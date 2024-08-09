#!/usr/bin/env python3
"""Temporary helper for the krcg -> vtes-rulings transition
"""
import importlib
import os
import faker
import re
import warnings
import yaml
import yamlfix
import yamlfix.config
import yamlfix.model
from krcg import vtes

vtes.VTES.load()


REFERENCES_COMMENT = """# Rulings always have a reference, they come from somewhere.
# Each reference should be a valid URL, with a key indicating the source and date.
# The only valid sources are the successive Rules Director, the Ruling Team and the rulebook:
#
# - TOM: Thomas R Wylie, from 1994
# - SFC: Shawn F. Carnes, occasionnaly before 1998
# - LSJ: L. Scott Johnson, from 1998-06-22 onward
# - PIB: Pascal Bertrand, from 2011-07-06 onward
# - ANK: Vincent Ripoll aka. "Ankha", from 2016-12-04 onward
# - RTR: Rules Team Ruling
# - RBK: Rulebook
#
# The date must follow ISO order YYYYMMDD, with a facultative suffix after a dash `-` to avoid collisions
"""

RULINGS_COMMENT = """# ## Design notes
#
# The core principle of this project is to provide a curated list of rulings
# **in a format that can withstand the passing of time**.
#
# We have lost countless ressources to the passing decades because they were hosted in unmaintained databases
# or in other impracticle formats.
# With hindsight, the most resilient formats are the simplest time-tested text-based standards.
# For example, the cards database, maintained in CSV format, or the TWD archive in plain HTML.
#
# Here, we have opted for YAML, because it offers a more flexible structure than CSV (multiple rulings per card),
# and is more readable than JSON, if anyone has to pick the project up without context in the future.
#
# ### Design principle
#
# **The rulings reference is a single self-sufficient YAML file. It is usable with a text editor, without processing.**
#
# ### Design details
#
# 1. The rulings can contain disciplines and card types symbols in brackets (eg. `[pot]`), see the list below
# 2. The rulings can contain card names in braces (eg. `{Abbot}`)
# 3. Each ruling ends with one or more rulings reference IDs in brackets.
#    References URLs are listed in the [references.yaml](rulings/references.yaml) file
# 4. Rulings are attached to a card, the format of the key is `<card_id>|<card_name>`, using the VEKN CSV cards IDs,
#    or to group of cards, using the `<id>|<name>` format, with an ID beginning with `G`. Cards groups are listed in
#    the [groups.yaml](rulings/groups.yaml) file.
#
# #### List of symbols
#
# - Inferior disciplines: abo, ani, aus, cel, chi, dai, dem, dom, for, mal, mel, myt, nec, obe, obf, obt, pot, pre, pro,
#   qui, san, ser, spi, str, tem, thn, tha, val, vic, vis
# - Superior disciplines: ABO, ANI, AUS, CEL, CHI, DAI, DEM, DOM, FOR, MAL, MEL, MYT, NEC, OBE, OBF, OBT, POT, PRE, PRO,
#   QUI, SAN, SER, SPI, STR, TEM, THN, THA, VAL, VIC, VIS
# - Virtues: vin, def, jus, inn, mar, ven, red
# - Card types: ACTION, POLITICAL, ALLY, RETAINER, EQUIPMENT, MODIFIER, REACTION, COMBAT, REFLEX, POWER
# - Other: FLIGHT, MERGED, CONVICTION
#
#  Note the "Vision" virtue uses the `[vsn]` trigram, to avoid confusion with the "Visceratika" discipline `[vis]`.
#  Some versions of the VEKN CSV do use `[vis]` for both indistinctively.
#
# ### Discarded options
#
# We discarded some options after careful consideration:
#
# 1. We could have used some **fields for the rulings** (separating symbol prefix, text, and references).
#    Although a proper API _should_ present the rulings structure this way, the reference file must be kept as simple
#    and readable as possible. The current structure _stays usable_ with very little post-treatment, which is better.
#    Producing an alternative, more structured version, of the rulings, could be done by automated parsing.
#
# 2. We could have used **cards IDs only** and not bother with the cards name, but this would make this reference file
#    unusable out of the box without the proper tooling. Such as it is, the file can be opened and a card searched for
#    by name with just a text editor.
#
# 3. The **cards names** are the ones used in the VEKN CSV reference file. We could have opted for other alternatives,
#    but we believe consistency with the existing reference is the stronger argument.
#    Note different versions of the same vampires share the same name with different IDs (advanced, higher group).
"""


def krcg_nid_to_new_nid(nid: str):
    card = vtes.VTES[int(nid.split("|")[0])]
    return f"{card.id}|{card._name}"


def main():
    all_references = {}
    multiple_references = {}
    all_rulings = {}
    all_groups = {}
    for card in vtes.VTES:
        for original_ruling in card.rulings["text"]:
            ruling, references = _extract_references(original_ruling)
            ruling, symbols = _extract_symbols(ruling)
            for r in references:
                all_references.setdefault(r, {})
                all_references[r]["link"] = card.rulings["links"][f"[{r}]"]
                all_references[r].setdefault("cards", {})
                all_references[r]["cards"].setdefault(f"{card.id}|{card.name}", [])
                all_references[r]["cards"][f"{card.id}|{card.name}"].append(
                    {"ruling": ruling, "symbols": list(symbols)}
                )
            if len(references) > 1:
                multiple_references.setdefault("|".join(references), {})
                multiref = multiple_references["|".join(references)]
                multiref.setdefault("cards", {})
                multiref["cards"].setdefault(f"{card.id}|{card.name}", [])
                multiref["cards"][f"{card.id}|{card.name}"].append(
                    {"ruling": ruling, "symbols": list(symbols)}
                )
            all_rulings.setdefault(f"{card.id}|{card._name}", [])
            all_rulings[f"{card.id}|{card._name}"].append(original_ruling)

    name_generator = faker.Faker()
    groups_by_sig = {}
    for uid, group_ruling in enumerate(
        yaml.safe_load(
            importlib.resources.files("rulings")
            .joinpath("general-rulings.yaml")
            .read_text("utf-8")
        ),
        1,
    ):
        text = group_ruling["ruling"]
        for card in group_ruling["cards"]:
            all_rulings[krcg_nid_to_new_nid(card)].remove(text)
        sig = frozenset(group_ruling["cards"])
        if sig in groups_by_sig:
            all_rulings[groups_by_sig[sig]].append(text)
        else:
            name = " ".join(s.capitalize() for s in name_generator.words())
            nid = f"G{uid:0>5}|{name}"
            all_groups[nid] = {
                krcg_nid_to_new_nid(card): "" for card in group_ruling["cards"]
            }
            all_rulings[nid] = [text]
            groups_by_sig[sig] = nid

    os.makedirs("output", exist_ok=True)
    with open("output/rulings.yaml", "w") as outf:
        outf.write(RULINGS_COMMENT)
        yaml.dump(all_rulings, outf, width=120, allow_unicode=True)
    with open("output/rulings_by_references.yaml", "w") as outf:
        yaml.dump(all_references, outf, width=120, allow_unicode=True)
    with open("output/multiple_references.yaml", "w") as outf:
        yaml.dump(multiple_references, outf, width=120, allow_unicode=True)
    with open("output/references.yaml", "w") as outf:
        outf.write(REFERENCES_COMMENT)
        yaml.dump(
            {k: v["link"] for k, v in all_references.items()},
            outf,
            width=120,
            allow_unicode=True,
        )
    with open("output/groups.yaml", "w") as outf:
        yaml.dump(all_groups, outf, width=120, allow_unicode=True)
    yamlfix.fix_files(
        ["output/references.yaml", "output/groups.yaml", "output/rulings.yaml"],
        config=yamlfix.model.YamlfixConfig(
            line_length=120, sequence_style="block_style"
        ),
    )


def _extract_references(text: str):
    ref_re = r"\[[a-zA-Z]+\s[0-9-]+\]"
    references = re.findall(ref_re, text)
    if not references:
        warnings.warn(f"no reference in ruling: {text}")
    return re.sub(ref_re, "", text).strip(), [r[1:-1] for r in references]


def _extract_symbols(text: str):
    symb_re = r"\[[a-zA-Z1 ]+\]"
    symbols = re.findall(symb_re, text)
    return re.sub(symb_re, "", text).strip(), [s[1:-1] for s in symbols]


if __name__ == "__main__":
    main()
