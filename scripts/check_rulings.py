#!/usr/bin/env python3
"""Script to check the rulings consistency"""

import asyncio
import datetime
import html.parser
import json
import os
import pathlib
import re
import sys
import typing
import urllib.parse
import urllib.request
import warnings

import aiohttp
import arrow
import krcg.collections
import krcg.loader
import krcg.rulings
import ruyaml


class UnknownCard(UserWarning): ...


class WrongName(UserWarning): ...


class UnusedGroup(UserWarning): ...


class UnusedReference(UserWarning): ...


class UnknownGroup(UserWarning): ...


class NotInGroup(UserWarning): ...


class UnknownReference(UserWarning): ...


class UnknownSource(UserWarning): ...


class Empty(UserWarning): ...


class DateError(UserWarning): ...


class URLMoved(UserWarning): ...


class HTTPError(UserWarning): ...


class UnknownThread(UserWarning): ...


class BadAnchor(UserWarning): ...


RE_CARD = re.compile(r"{[^}]+}")


def ruling_texts(entry: str | dict) -> list[str]:
    """A ruling entry is a plain string, or a {text, overrides} map for group overrides."""
    if isinstance(entry, str):
        return [entry]
    return [entry["text"], *(entry.get("overrides") or {}).values()]


def check_card_name(context: str, nid: str, cards: krcg.collections.CardDict) -> None:
    id_, _, name = nid.partition("|")
    try:
        official_name = cards[int(id_)].printed_name
    except (KeyError, ValueError):
        warnings.warn(UnknownCard(f"In {context}: {nid}"))
        return
    if name != official_name:
        warnings.warn(
            WrongName(f'In {context}: "{nid}" should be named "{id_}|{official_name}"')
        )


def check_card_tokens(
    context: str, text: str, cards: krcg.collections.CardDict
) -> None:
    """Tokens carry the unique name, not the printed one the keys use: a token names a card
    inside a sentence, so it keeps the suffix telling two same-named cards apart.
    """
    for token in RE_CARD.findall(text):
        id_, pipe, name = token[1:-1].partition("|")
        if not (pipe and id_.isdigit()):
            warnings.warn(
                WrongName(f"In {context}: {token} should be {{<card_id>|<card_name>}}")
            )
            continue
        try:
            official_name = cards[int(id_)].unique_name
        except KeyError:
            warnings.warn(UnknownCard(f"In {context}: {token}"))
            continue
        if name != official_name:
            warnings.warn(
                WrongName(
                    f'In {context}: "{token}" should be "{{{id_}|{official_name}}}"'
                )
            )


def check_cards(rulings: dict, groups: dict):
    cards = krcg.loader.load_local()
    used = set()
    for item, item_rulings in rulings.items():
        id_, _, _ = item.partition("|")
        if id_.startswith("G"):
            if item not in groups:
                warnings.warn(
                    UnknownGroup(f"{item} got rulings but is not in groups.yaml")
                )
            used.add(item)
        else:
            check_card_name("rulings", item, cards)
        if not item_rulings:
            warnings.warn(Empty(f"{item} is listed in rulings.yaml but has no rulings"))
        for entry in item_rulings:
            if isinstance(entry, str):
                check_card_tokens(f"{item} rulings", entry, cards)
                continue
            check_card_tokens(f"{item} rulings", entry["text"], cards)
            for override, text in (entry.get("overrides") or {}).items():
                check_card_name(f"{item} overrides", override, cards)
                if override.partition("|")[0] not in {
                    c.partition("|")[0] for c in groups.get(item, {})
                }:
                    msg = f"In {item} overrides: {override} is not in the group"
                    warnings.warn(NotInGroup(msg))
                check_card_tokens(f"{item} override {override}", text, cards)

    for unused in set(groups.keys()) - used:
        warnings.warn(UnusedGroup(unused))

    for group, group_cards in groups.items():
        for card in group_cards:
            check_card_name(f"group {group}", card, cards)


class SmartParser(html.parser.HTMLParser):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._queue = []
        self.state = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._queue.append(set())
        self.on_tag(tag, dict(attrs))

    def on_tag(self, tag: str, attrs: dict[str, str | None]) -> None:
        return

    def set_state(self, state: str):
        self._queue[-1].add(state)
        self.state.add(state)

    def handle_endtag(self, tag: str) -> None:
        self.after_tag(tag)
        states = self._queue.pop()
        self.state -= states

    def after_tag(self, tag) -> None:
        return

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)


VEKN_AUTHORS = {
    "213-ankha": "ANK",
    "74-pascal-bertrand": "PIB",
}


class VEKNParser(SmartParser):
    """Read the date, the author and the thanks of one post on a forum page.

    A page holds several posts, each headed by its own dates and anchor, and the URL
    names the one that is the ruling. Reading the first date on the page reads the
    wrong post, and the reference then looks misdated when it is not.
    """

    def __init__(self, msg_id: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.msg_id: str = msg_id
        self.author: str = ""
        self.date: datetime.date = None
        #: who pressed Thank You on that post
        self.thanked: set[str] = set()
        #: dates read since the current post header started
        self._dates: list[datetime.date] = []

    def on_tag(self, tag: str, attrs: dict[str, str | None]) -> None:
        # Each post header holds its dates and its anchor, in that order.
        if tag == "small":
            self._dates = []
        if tag == "span" and "kdate" in (attrs.get("class") or ""):
            self.set_state("DATE")
        if tag == "a" and (attrs.get("id") or "").isdigit():
            # A post opens on its own anchor, and so closes the one before it:
            # without that, a post carrying no thanks would take the next one's.
            self.state.discard("MESSAGE")
            if attrs["id"] == self.msg_id:
                # A post shows when it was posted, then when it was last edited.
                if self._dates:
                    self.date = self._dates[0]
                self.state.add("MESSAGE")
        if "MESSAGE" not in self.state:
            return
        if tag == "div" and "kmessage-thankyou" in (attrs.get("class") or ""):
            self.set_state("THANKS")
        if tag == "a" and "kwho" in (attrs.get("class") or ""):
            who = VEKN_AUTHORS.get(name := attrs["href"].split("/")[-1], name)
            if "THANKS" in self.state:
                self.thanked.add(who)
            elif not self.author:
                self.author = who

    def handle_data(self, data: str) -> None:
        if "DATE" not in self.state:
            return
        try:
            self._dates.append(arrow.get(data, "D MMM YYYY").date())
        except arrow.ParserError:
            pass


#: References whose source is gone for good: the page 404s and no copy of it is
#: known. Every reference resolves at the moment -- the last one that did not,
#: ANK 20210529, was a VEKN forum topic the forum dropped, and it was copied
#: into the newsgroup archive from the Internet Archive's capture rather than
#: left dangling. The mechanism stays for the next one.
UNREACHABLE: dict[str, str] = {}

LEGAL_DOMAINS = {
    "usenet.krcg.org",
    "www.blackchantry.com",
    "www.vekn.net",
}

#: The newsgroup archive the newsgroup-era references point into. A local clone is
#: checked first -- it is what the maintainer edits against -- and the index the
#: site publishes is the fallback for anyone who has not cloned it.
ARCHIVE_ENV = "NEWSGROUP_ARCHIVE"
DEFAULT_ARCHIVE = pathlib.Path(__file__).resolve().parents[2] / "newsgroup-archive"
ARCHIVE_INDEX = "https://usenet.krcg.org/threads.json"

RE_ARCHIVE_PATH = re.compile(r"^/t/([A-Za-z0-9_-]+)/$")
#: `#m0` is the first message of a thread, wherever the thread came from.
RE_ANCHOR = re.compile(r"^m(\d+)$")
#: A thread copied from a forum keeps the number that forum gave each post, and
#: a citation written against the forum keeps its own anchor by pointing at it.
RE_POST = re.compile(r"^\d+$")


class ArchivedThread(typing.NamedTuple):
    messages: int
    #: The post numbers a forum gave, where there are any. Only the JSON records
    #: them, so a run against the published index has None rather than a set:
    #: unknown, which is not the same as empty.
    posts: set[str] | None


def archived_threads(thread_ids: set[str]) -> dict[str, ArchivedThread]:
    """What each cited thread holds.

    The thread id is in the file name, so the local clone is read by name and only
    the cited threads are opened.
    """
    root = pathlib.Path(os.environ.get(ARCHIVE_ENV) or DEFAULT_ARCHIVE)
    if (root / "threads").is_dir():
        threads = {}
        for path in (root / "threads").glob("*/*.json"):
            # threads/<year>/<date>_<time>_<ThreadId>.json
            thread_id = path.stem.split("_", 2)[-1]
            if thread_id in thread_ids:
                messages = json.loads(path.read_text())["Messages"]
                threads[thread_id] = ArchivedThread(
                    len(messages), {m["Id"] for m in messages if "Id" in m}
                )
        return threads
    print(f"no archive in {root}, using {ARCHIVE_INDEX}")
    with urllib.request.urlopen(ARCHIVE_INDEX) as response:
        index = json.loads(response.read())
    # [thread id, title, first date, authors, message count]
    return {
        row[0]: ArchivedThread(row[4], None) for row in index if row[0] in thread_ids
    }


def check_archive_references(archive_references: dict[str, urllib.parse.ParseResult]):
    """Check the newsgroup citations still point at a message that exists.

    A `#m0` anchor is positional, so a thread losing or gaining a message silently
    moves every citation after it. A citation into a thread copied from a forum
    names the post by the number that forum gave it instead, which does not move.
    Author and date are deliberately not checked: a citation may point at a post
    quoting the Rules Director when his own post was never archived.
    """
    threads = {}
    for reference, url in archive_references.items():
        match = RE_ARCHIVE_PATH.match(url.path)
        if not match:
            warnings.warn(
                UnknownThread(f"Reference {reference}: {url.path} is not a thread URL")
            )
            continue
        threads[reference] = match.group(1)
    try:
        archived = archived_threads(set(threads.values()))
    except OSError as e:
        warnings.warn(HTTPError(f"cannot read the newsgroup archive: {e}"))
        return
    for reference, thread_id in threads.items():
        if thread_id not in archived:
            warnings.warn(
                UnknownThread(f"Reference {reference}: no thread {thread_id}")
            )
            continue
        thread = archived[thread_id]
        fragment = archive_references[reference].fragment
        if not fragment:
            # The thread survived but the cited reply did not: no anchor to check.
            continue
        match = RE_ANCHOR.match(fragment)
        if match:
            if int(match.group(1)) >= thread.messages:
                warnings.warn(
                    BadAnchor(
                        f"Reference {reference}: #{fragment} is not a message of "
                        f"{thread_id} ({thread.messages} messages)"
                    )
                )
        elif not RE_POST.match(fragment):
            warnings.warn(
                BadAnchor(f"Reference {reference}: #{fragment} is not an anchor")
            )
        elif thread.posts is not None and fragment not in thread.posts:
            warnings.warn(
                BadAnchor(
                    f"Reference {reference}: #{fragment} is not a post of {thread_id}"
                )
            )


RULING_SOURCES = krcg.rulings.RULING_AUTHORS


async def fetch_ruling_parameters(
    session: aiohttp.ClientSession, reference: str, url: str, date: str, source: str
):
    parsed_url = urllib.parse.urlparse(url)
    parser = VEKNParser(parsed_url.fragment)

    async with session.get(url) as response:
        if response.history:
            warnings.warn(
                URLMoved(f"Reference {reference}: URL moved to {response.url}")
            )
        parser.feed(await response.text())

    if parser.date is None:
        # No post carrying that anchor: the topic is gone, or was renumbered.
        if reference not in UNREACHABLE:
            warnings.warn(HTTPError(f"Reference {reference}: no post {url} to read"))
        return
    if reference in UNREACHABLE:
        warnings.warn(
            URLMoved(
                f"Reference {reference} reads again: {UNREACHABLE[reference]} is no "
                f"longer true, take it out of UNREACHABLE"
            )
        )
    # The forum stamps posts in its own timezone, so a ruling given late in the
    # evening is filed under the following day. A day either way is not an error.
    if abs(parser.date - datetime.date.fromisoformat(date)).days > 1:
        warnings.warn(
            DateError(
                f"Reference {reference} uses date {date}, "
                f"but the URL is from {parser.date.isoformat()}"
            )
        )
    # A ruling is sometimes stated by someone else and endorsed by the Rules Director
    # pressing Thank You on it, which is the forum's version of a "Correct." reply.
    # That post is then his ruling as much as one he typed himself.
    if parser.author != source and source not in parser.thanked:
        warnings.warn(
            UnknownSource(
                f"Reference {reference} has source {source}, but the URL author is "
                f"{parser.author} and {source} did not thank the post"
            )
        )


async def check_references_are_valid(references: dict):
    to_check = []
    archive_references = {}
    for reference, url in references.items():
        parsed_url = urllib.parse.urlparse(url)
        hostname = parsed_url.hostname
        if hostname not in LEGAL_DOMAINS:
            warnings.warn(
                UnknownSource(
                    f"Ruling {reference} is not from a reference domain: {hostname}"
                )
            )
            continue
        source = reference[:3]
        if source not in RULING_SOURCES:
            warnings.warn(
                UnknownSource(
                    f"Ruling {reference} is not from a trusted source: {source}."
                    f"Prefix must be one of {', '.join(RULING_SOURCES.keys())}"
                )
            )
            continue
        date = None
        if source != "RBK":
            try:
                date = datetime.date.fromisoformat(reference[4:12]).isoformat()
            except ValueError as e:
                warnings.warn(DateError(f"Ruling {reference} has a wrong date: {e}"))
                continue
        name, date_from, date_to = RULING_SOURCES[source]
        if date and (date_from or date_to):
            ref_date = datetime.date.fromisoformat(date)
            if date_from and ref_date < date_from:
                warnings.warn(
                    DateError(
                        f"Reference {reference}: {name} was not Rules Director yet "
                        f"on {ref_date}"
                    )
                )
            if date_to and ref_date > date_to:
                warnings.warn(
                    DateError(
                        f"Reference {reference}: {name} was not Rules Director anymore "
                        f"on {ref_date}"
                    )
                )
        if hostname == "usenet.krcg.org":
            archive_references[reference] = parsed_url
        elif hostname == "www.vekn.net" and source not in {"RBK", "RTR"}:
            if parsed_url.path.startswith("/forum"):
                to_check.append(
                    {"reference": reference, "url": url, "date": date, "source": source}
                )
            else:
                warnings.warn(
                    UnknownSource(
                        f"Ruling {reference} should be from the VEKN forum: "
                        f"only RTR and RBK rulings are allowed otherwise. ({url})"
                    )
                )
    # Every reference but the forum's now lives in the archive, which is read as
    # data rather than fetched page by page.
    check_archive_references(archive_references)
    print("checking rulings sources on the web... this takes a few minutes")
    async with aiohttp.ClientSession() as session:
        ret = await asyncio.gather(
            *[fetch_ruling_parameters(session, **params) for params in to_check],
            return_exceptions=True,
        )
        for i, item in enumerate(ret):
            if isinstance(item, Exception):
                warnings.warn(
                    HTTPError(f"{to_check[i]['reference']} failed to fetch: {item}")
                )


#: Any three-letter prefix, not just the known sources: a typo'd source (KOT for RTR) would
#: otherwise read as prose and be flagged by nothing.
RE_RULING_REFERENCE = re.compile(r"\[([A-Z]{3})\s(?![A-Z])[\w-]+\]")


def check_references_are_used(rulings: dict, references: dict):
    used = set()
    for item, item_rulings in rulings.items():
        for ruling in item_rulings:
            for text in ruling_texts(ruling):
                for match in RE_RULING_REFERENCE.finditer(text):
                    token = match.group(0)
                    if match.group(1) not in RULING_SOURCES:
                        warnings.warn(UnknownSource(f"In {item} rulings: {token}"))
                    elif token[1:-1] not in references:
                        warnings.warn(UnknownReference(f"In {item} rulings: {token}"))
                    used.add(token[1:-1])
    for unused in set(references.keys()) - used:
        if unused.startswith("RBK"):
            continue
        warnings.warn(UnusedReference(unused))


def main():
    rulings_path = pathlib.Path(__file__).parents[1] / "rulings"
    yaml = ruyaml.YAML(typ="safe")
    groups = yaml.load(rulings_path / "groups.yaml")
    references = yaml.load(rulings_path / "references.yaml")
    rulings = yaml.load(rulings_path / "rulings.yaml")
    record_copy = []
    with warnings.catch_warnings(record=True) as record:
        check_cards(rulings, groups)
        check_references_are_used(rulings, references)
        asyncio.run(check_references_are_valid(references))
        record_copy = record
    for warning in record_copy:
        print(f"{warning.category.__name__}: {warning.message}", file=sys.stderr)
    if record_copy:
        sys.exit(1)


if __name__ == "__main__":
    main()
