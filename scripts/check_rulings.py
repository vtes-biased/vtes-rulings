#!/usr/bin/env python3
"""Script to check the rulings consistency
"""
import arrow
import asyncio
import aiohttp
import datetime
import html.parser
import krcg.vtes
import pathlib
import random
import re
import ruyaml
import urllib.parse
import sys
import warnings


class UnknownCard(UserWarning): ...


class WrongName(UserWarning): ...


class UnusedGroup(UserWarning): ...


class UnusedReference(UserWarning): ...


class UnknownGroup(UserWarning): ...


class UnknownReference(UserWarning): ...


class UnknownSource(UserWarning): ...


class Empty(UserWarning): ...


class DateError(UserWarning): ...


class URLMoved(UserWarning): ...


class HTTPError(UserWarning): ...


def check_cards(ruling: dict, groups: dict):
    krcg_cards = krcg.vtes.VTES
    krcg_cards.load_from_vekn()
    used = set()
    for item, rulings in ruling.items():
        id_, name = item.split("|")
        if id_.startswith("G"):
            if item not in groups:
                warnings.warn(
                    UnknownGroup(f"{item} got rulings but is not in groups.yaml")
                )
            used.add(item)
        else:
            try:
                official_name = krcg_cards[int(id_)]._name
            except KeyError:
                warnings.warn(UnknownCard(f"In rulings: {item}"))
            if name != official_name:
                warnings.warn(
                    WrongName(
                        f'In rulings: "{item}" should be named "{id_}|{official_name}"'
                    )
                )
        if not rulings:
            warnings.warn(Empty(f"{item} is listed in rulings.yaml but has no rulings"))

    for unused in set(groups.keys()) - used:
        warnings.warn(UnusedGroup(unused))

    for group, cards in groups.items():
        for card in cards:
            id_, name = card.split("|")
            try:
                official_name = krcg_cards[int(id_)]._name
            except KeyError:
                warnings.warn(UnknownCard(f"In group: {group}"))
            if name != official_name:
                warnings.warn(
                    WrongName(
                        f'In group {group}: "{card}" should be named '
                        f'"{id_}|{official_name}"'
                    )
                )


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


GGROUPS_AUTHORS = {
    "LSJ": "LSJ",
    "LSJ (VtES Rep)": "LSJ",
    "L. Scott Johnson": "LSJ",
    "Thomas R Wylie": "TOM",
}


class GGroupParser(SmartParser):
    def __init__(self, msg_id: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.msg_id: str = msg_id
        self.author: str = ""
        self.date: datetime.date = None

    def on_tag(self, tag: str, attrs: dict[str, str | None]) -> None:
        if "MESSAGE" not in self.state and tag != "section":
            return
        if "data-doc-id" in attrs and attrs["data-doc-id"] == self.msg_id:
            self.set_state("MESSAGE")
            author = attrs["data-author"]
            self.author = GGROUPS_AUTHORS.get(author, author)

    def handle_data(self, data: str) -> None:
        if "MESSAGE" not in self.state:
            return
        if not self.date:
            try:
                self.date = arrow.get(data, "MMM D, YYYY").date()
            except arrow.ParserError:
                pass


VEKN_AUTHORS = {
    "213-ankha": "ANK",
    "74-pascal-bertrand": "PIB",
}


class VEKNParser(SmartParser):
    def __init__(self, msg_id: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.msg_id: str = msg_id
        self.author: str = ""
        self.date: datetime.date = None

    def on_tag(self, tag: str, attrs: dict[str, str | None]) -> None:
        if (
            "MESSAGE" not in self.state
            and tag == "span"
            and "kdate" in attrs.get("class", "")
        ):
            self.set_state("DATE")
        if tag == "a" and attrs.get("id", "") == self.msg_id:
            self.state.add("MESSAGE")
        if (
            "MESSAGE" in self.state
            and not self.author
            and tag == "a"
            and "kwho" in attrs.get("class", "")
        ):
            author = attrs["href"].split("/")[-1]
            self.author = VEKN_AUTHORS.get(author, author)

    def handle_data(self, data: str) -> None:
        if "DATE" not in self.state:
            return
        if not self.date:
            try:
                self.date = arrow.get(data, "D MMM YYYY").date()
            except arrow.ParserError:
                pass


LEGAL_DOMAINS = {
    "boardgamegeek.com",
    "groups.google.com",
    "www.blackchantry.com",
    "www.boardgamegeek.com",
    "www.vekn.net",
}

RULING_SOURCES = {
    "TOM": (
        "Thomas R Wylie",
        datetime.date.fromisoformat("1994-12-15"),
        datetime.date.fromisoformat("1996-07-29"),
    ),
    "SFC": (
        "Shawn F. Carnes",
        datetime.date.fromisoformat("1996-07-29"),
        datetime.date.fromisoformat("1996-10-18"),
    ),
    "JON": (
        "Jon Wilkie",
        datetime.date.fromisoformat("1996-10-18"),
        datetime.date.fromisoformat("1997-02-24"),
    ),
    "LSJ": (
        "L. Scott Johnson",
        datetime.date.fromisoformat("1997-02-24"),
        datetime.date.fromisoformat("2011-07-06"),
    ),
    "PIB": (
        "Pascal Bertrand",
        datetime.date.fromisoformat("2011-07-06"),
        datetime.date.fromisoformat("2016-12-04"),
    ),
    "ANK": ('Vincent "Ankha" Ripoll', datetime.date.fromisoformat("2016-12-04"), None),
    "RTR": ("Rules Team Ruling", None, None),
    "RBK": ("Rulebook", None, None),
}


async def fetch_ruling_parameters(
    session: aiohttp.ClientSession, reference: str, url: str, date: str, source: str
):
    parsed_url = urllib.parse.urlparse(url)
    if parsed_url.hostname == "groups.google.com":
        parser = GGroupParser(parsed_url.path.split("/")[-1])
    elif parsed_url.hostname == "www.vekn.net":
        parser = VEKNParser(parsed_url.fragment)

    async with session.get(url) as response:
        if response.history:
            if response.url.path.startswith("/sorry/index"):
                raise HTTPError("Google rate limit hit")
            warnings.warn(
                URLMoved(f"Reference {reference}: URL moved to {response.url}")
            )
        parser.feed(await response.text())

    if parser.date.isoformat() != date:
        warnings.warn(
            DateError(
                f"Reference {reference} uses date {date}, "
                f"but the URL is from {parser.date.isoformat()}"
            )
        )
    if parser.author != source:
        warnings.warn(
            UnknownSource(
                f"Reference {reference} has source {source}, "
                f"but the URL author is {parser.author}"
            )
        )


async def check_references_are_valid(references: dict):
    to_check = []
    slow_check = []
    for reference, url in references.items():
        hostname = urllib.parse.urlparse(url).hostname
        if hostname not in LEGAL_DOMAINS:
            warnings.warn(
                UnknownSource(
                    f"Ruling {reference} is not from a reference domain: {hostname}"
                )
            )
            continue
        source = reference[:3]
        if source == "RBK":
            date = None
        else:
            try:
                date = datetime.date.fromisoformat(reference[4:12]).isoformat()
            except ValueError as e:
                warnings.warn(DateError(f"Ruling {reference} has a wrong date: {e}"))
        if hostname == "groups.google.com" and source != "RTR":
            slow_check.append(
                {"reference": reference, "url": url, "date": date, "source": source}
            )
        if hostname == "www.vekn.net" and source not in {"RBK", "RTR"}:
            if urllib.parse.urlparse(url).path.startswith("/forum"):
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
                continue
        if source not in RULING_SOURCES:
            warnings.warn(
                UnknownSource(
                    f"Ruling {reference} is not from a trusted source: {source}."
                    f"Prefix must be one of {', '.join(RULING_SOURCES.keys())}"
                )
            )
            continue
        name, date_from, date_to = RULING_SOURCES[source]
        if date_from or date_to:
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
    print("checking rulings sources on the web... this takes a few minutes")
    async with aiohttp.ClientSession() as session:
        # Can't gather on google groups or we hit google rate limit
        ret = await asyncio.gather(
            *[fetch_ruling_parameters(session, **params) for params in to_check],
            return_exceptions=True,
        )
        for i, item in enumerate(ret):
            if isinstance(item, Exception):
                warnings.warn(
                    HTTPError(f"{to_check[i]['reference']}failed to fetch: {item}")
                )
        ret = []
        random.seed()
        for params in slow_check:
            try:
                ret.append(await fetch_ruling_parameters(session, **params))
            except HTTPError as e:
                ret.append(e)
                break
            except Exception as e:
                ret.append(e)
            await asyncio.sleep(random.random() * 5)
        for i, item in enumerate(ret):
            if isinstance(item, Exception):
                warnings.warn(
                    HTTPError(f"{slow_check[i]['reference']}failed to fetch: {item}")
                )


RE_RULING_REFERENCE = re.compile(
    r"\[(?:" + r"|".join(RULING_SOURCES) + r")\s[\w0-9-]+\]"
)


def check_references_are_used(rulings: dict, references: dict):
    used = set()
    for item, rulings in rulings.items():
        for ruling in rulings:
            for token in RE_RULING_REFERENCE.findall(ruling):
                reference = token[1:-1]
                if reference not in references:
                    warnings.warn(UnknownReference(f"In {item} rulings: {token}"))
                used.add(reference)
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
        exit(1)


if __name__ == "__main__":
    main()
