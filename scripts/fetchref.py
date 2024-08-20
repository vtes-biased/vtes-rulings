#!/usr/bin/env python3
import aiohttp
import aiohttp.connector
import arrow
import asyncio
import datetime
import html.parser
import pprint


# URL = "https://groups.google.com/g/rec.games.trading-cards.jyhad/c/4LXlqwmGQGc/m/S8aQ4et5KMIJ"
URL = "http://www.vekn.net/forum/rules-questions/76933-cock-robin-jack-of-both-sides#90064"


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
        print("SET STATE: ", state)
        self._queue[-1].add(state)
        self.state.add(state)

    def handle_endtag(self, tag: str) -> None:
        self.after_tag(tag)
        states = self._queue.pop()
        if states:
            print("REMOVE STATES: ", states)
        self.state -= states

    def after_tag(self, tag) -> None:
        return

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)


class GGroupParser(SmartParser):
    def __init__(self, msg_id: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.msg_id: str = msg_id
        self.author: str = ""
        self.date: datetime.date = None

    def on_tag(self, tag: str, attrs: dict[str, str | None]) -> None:
        if "MESSAGE" not in self.state and tag != "section":
            return
        print("ON", tag, attrs)
        if "data-doc-id" in attrs and attrs["data-doc-id"] == self.msg_id:
            self.set_state("MESSAGE")
            self.author = attrs["data-author"]

    def handle_data(self, data: str) -> None:
        if "MESSAGE" not in self.state:
            return
        if not self.date:
            try:
                self.date = arrow.get(data, "MMM D, YYYY")
            except arrow.ParserError:
                pass


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
            self.author = attrs["href"].split("/")[-1]

    def handle_data(self, data: str) -> None:
        if "DATE" not in self.state:
            return
        try:
            self.date = arrow.get(data, "D MMM YYYY")
        except arrow.ParserError:
            pass


async def fetch(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            parser = VEKNParser("90064")
            text = await response.text()
            parser.feed(text)
            print(pprint.pprint({"author": parser.author, "date": parser.date}))


def main():
    asyncio.run(fetch(URL))


if __name__ == "__main__":
    main()
