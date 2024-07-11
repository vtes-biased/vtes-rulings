import collections
import dataclasses
import enum
import importlib
import re
import yaml

import krcg.cards
import krcg.vtes

ANKHA_SYMBOLS = {
    "abo": "w",
    "ani": "i",
    "aus": "a",
    "cel": "c",
    "chi": "k",
    "dai": "y",
    "dem": "e",
    "dom": "d",
    "for": "f",
    "mal": "<",
    "maleficia": "<",
    "mel": "m",
    "myt": "x",
    "nec": "n",
    "obe": "b",
    "obf": "o",
    "obt": "$",
    "pot": "p",
    "pre": "r",
    "pro": "j",
    "qui": "q",
    "san": "g",
    "ser": "s",
    "spi": "z",
    "str": "+",
    "striga": "+",
    "tem": "?",
    "thn": "h",
    "tha": "t",
    "val": "l",
    "vic": "v",
    "vis": "u",
    "ABO": "W",
    "ANI": "I",
    "AUS": "A",
    "CEL": "C",
    "CHI": "K",
    "DAI": "Y",
    "DEM": "E",
    "DOM": "D",
    "FOR": "F",
    "MAL": ">",
    "MEL": "M",
    "MYT": "X",
    "NEC": "N",
    "OBE": "B",
    "OBF": "O",
    "OBT": "£",
    "POT": "P",
    "PRE": "R",
    "PRO": "J",
    "QUI": "Q",
    "SAN": "G",
    "SER": "S",
    "SPI": "Z",
    "STR": "=",
    "TEM": "!",
    "THN": "H",
    "THA": "T",
    "VAL": "L",
    "VIC": "V",
    "VIS": "U",
    "vin": ")",
    "viz": ")",
    "def": "@",
    "jus": "%",
    "jud": "%",
    "inn": "#",
    "mar": "&",
    "ven": "(",
    "red": "*",
    "ACTION": "0",
    "POLITICAL": "2",
    "POLITICAL ACTION": "2",
    "ALLY": "3",
    "RETAINER": "8",
    "EQUIPMENT": "5",
    "MODIFIER": "1",
    "ACTION MODIFIER": "1",
    "REACTION": "7",
    "COMBAT": "4",
    "REFLEX": "6",
    "POWER": "§",
    "FLIGHT": "^",
    "flight": "^",
    "MERGED": "µ",
    "CONVICTION": "¤",
}


def parse_symbols(s: str) -> dict[str, str]:
    return {
        symbol: ANKHA_SYMBOLS[symbol[1:-1]]
        for symbol in re.findall(r"\[[a-zA-Z ]+\]", s)
        if symbol[1:-1] in ANKHA_SYMBOLS
    }


@dataclasses.dataclass(frozen=True)
class NID:
    """Named Identifier"""

    uid: str
    name: str

    @classmethod
    def from_str(cls, s: str):
        uid, name = s.split("|")
        return cls(uid=uid, name=name)

    def __str__(self):
        return f"{self.uid}|{self.name}"


@dataclasses.dataclass
class Reference:
    uid: str
    url: str


class Status(enum.StrEnum):
    APPROVED = enum.auto()
    DISCUSSED = enum.auto()
    PROPOSAL = enum.auto()


@dataclasses.dataclass
class CardRef:
    uid: str
    name: str
    unique_name: str
    printed_name: str
    img: str
    prefix: str = ""
    symbols: dict[str, str] = dataclasses.field(default_factory=dict)


@dataclasses.dataclass
class Ruling:
    text: str
    symbols: dict[str, str] = dataclasses.field(default_factory=dict)
    references: dict[str, Reference] = dataclasses.field(default_factory=dict)
    cards: dict[str, CardRef] = dataclasses.field(default_factory=dict)
    group: NID | None = None
    status: Status = Status.APPROVED


@dataclasses.dataclass
class Group:
    uid: str
    name: str
    cards: list[CardRef] = dataclasses.field(default_factory=list)
    rulings: list[Ruling] = dataclasses.field(default_factory=list)
    status: Status = Status.APPROVED


@dataclasses.dataclass
class GroupRef:
    uid: str
    name: str
    prefix: str = ""
    symbols: dict[str, str] = dataclasses.field(default_factory=dict)


@dataclasses.dataclass
class CardVariant:
    uid: str
    group: int | None = None
    advanced: bool = False


@dataclasses.dataclass(kw_only=True)
class Card:
    uid: str
    name: str
    types: list[str]
    disciplines: list[str]
    text: str
    unique_name: str
    printed_name: str
    img: str
    symbols: dict[str, str] = dataclasses.field(default_factory=dict)
    text_symbols: dict[str, str] = dataclasses.field(default_factory=dict)
    rulings: list[Ruling] = dataclasses.field(default_factory=list)
    groups: list[GroupRef] = dataclasses.field(default_factory=list)
    backrefs: list[CardRef] = dataclasses.field(default_factory=list)


@dataclasses.dataclass
class CryptCard(Card):
    capacity: int
    group: str
    clan: str
    advanced: bool = False
    variants: list[CardVariant] = dataclasses.field(default_factory=list)


@dataclasses.dataclass
class LibraryCard(Card):
    pool_cost: int = 0
    blood_cost: int = 0
    conviction_cost: int = 0


class Rulings:

    def __init__(self):
        self.krcg_cards: krcg.cards.CardMap = None
        # TODO reassess if we need to keep those in memory
        self.yaml_references: dict[str, str] = {}
        self.yaml_groups: dict[NID, dict[NID, str]] = {}
        self.yaml_rulings: dict[NID, list[str]] = {}
        # TODO we _might_ want a DB cache of current proposals
        #
        # these are our in-memory working datasets
        self.cards: dict[str, Card] = {}
        self.groups: dict[str, Group] = {}  # groups by ID
        # The following are for convenience
        # groups by card ID
        self.groups_rev: dict[str, set[Group]] = collections.defaultdict(set)
        # cards referencing a given card in their ruling
        self.backrefs: dict[str, set[Card]] = collections.defaultdict(set)

        # ################################################### Load cards lists from VEKN
        self.krcg_cards = krcg.cards.CardMap()
        self.krcg_cards.load_from_vekn()
        # ####################################################### Load YAML rulings data
        self.yaml_references = yaml.safe_load(
            importlib.resources.files("vtesrulings.data")
            .joinpath("references.yaml")
            .read_text("utf-8")
        )
        self.yaml_groups = {
            NID.from_str(k): {NID.from_str(kk): vv for kk, vv in v.items()}
            for k, v in yaml.safe_load(
                importlib.resources.files("vtesrulings.data")
                .joinpath("groups.yaml")
                .read_text("utf-8")
            ).items()
        }
        self.yaml_rulings = {
            NID.from_str(k): v
            for k, v in yaml.safe_load(
                importlib.resources.files("vtesrulings.data")
                .joinpath("rulings.yaml")
                .read_text("utf-8")
            ).items()
        }
        # ###################################################### Build our own cards map
        for card in self.krcg_cards:
            if card.crypt:
                cls = CryptCard
                kwargs = {
                    "clan": card.clans[0],
                    "capacity": card.capacity,
                    "group": card.group,
                    "advanced": card.adv,
                }
            else:
                cls = LibraryCard
                kwargs = {
                    "pool_cost": card.pool_cost,
                    "blood_cost": card.blood_cost,
                    "conviction_cost": card.conviction_cost,
                }
            our_card = cls(
                uid=str(card.id),
                name=card._name,
                types=card.types,
                text=card.card_text,
                text_symbols=parse_symbols(card.card_text),
                disciplines=card.disciplines,
                unique_name=card.name,
                printed_name=card.printed_name,
                img=card.url,
                **kwargs,
            )
            for s in card.types:
                s = s.upper()
                if s in ANKHA_SYMBOLS:
                    our_card.symbols[s] = ANKHA_SYMBOLS[s]
            for s in card.disciplines:
                our_card.symbols[s] = ANKHA_SYMBOLS[s]
            for key, uid in card.variants.items():
                our_card.variants.append(
                    CardVariant(
                        uid=uid,
                        group=int(key[1]) if key[0] == "G" else None,
                        advanced=True if key[-3:] == "ADV" else False,
                    )
                )
            self.cards[str(card.id)] = our_card
        # ########################################################### Build cards groups
        for group, cards_list in self.yaml_groups.items():
            group = Group(uid=group.uid, name=group.name)
            for card_ref, prefix in cards_list.items():
                card = self.cards[card_ref.uid]
                group.cards.append(
                    CardRef(
                        uid=card_ref.uid,
                        name=card_ref.name,
                        unique_name=card.unique_name,
                        printed_name=card.printed_name,
                        img=card.img,
                        prefix=prefix,
                        symbols=parse_symbols(prefix),
                    )
                )
                self.groups_rev[card_ref.uid].add(NID(uid=group.uid, name=group.name))
            self.groups[group.uid] = group
        # ################################################################## Add rulings
        for nid, rulings in self.yaml_rulings.items():
            if nid.uid[0] == "G":
                group = self.groups[nid.uid]
                group.rulings = [
                    self.build_rulings(
                        ruling, group=NID(uid=group.uid, name=group.name)
                    )
                    for ruling in rulings
                ]
                for card_ref in group.cards:
                    card = self.cards[card_ref.uid]
                    card.rulings.extend(group.rulings)
            else:
                card = self.cards[nid.uid]
                for line in rulings:
                    ruling = self.build_rulings(line)
                    card.rulings.append(ruling)
                    for card_ref in ruling.cards.values():
                        self.backrefs[card_ref.uid].add(
                            NID(uid=card.uid, name=card.name)
                        )

    def build_rulings(self, text: str, group: NID | None = None) -> Ruling:
        ruling = Ruling(text=text, group=group)
        ruling.symbols = parse_symbols(text)
        for reference in re.findall(r"\[[a-zA-Z]+\s[0-9-]+\]", text):
            inner_reference = reference[1:-1]
            ruling.references[reference] = Reference(
                inner_reference, self.yaml_references[inner_reference]
            )
        for card_ref in re.findall(r"{[^}]*}", text):
            match = self.krcg_cards.get(card_ref[1:-1])
            if not match:
                continue
            card = self.cards[str(match.id)]
            ruling.cards[card_ref] = CardRef(
                uid=card.uid,
                name=card.name,
                unique_name=card.unique_name,
                printed_name=card.printed_name,
                img=card.img,
            )
        return ruling

    def get_card(self, card_id: str) -> Card:
        return self.cards[card_id]


RULINGS = Rulings()
