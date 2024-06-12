#!/usr/bin/env python3
"""Temporary helper for the krcg -> vtes-rulings transition
"""

import os
import re
import warnings
import yaml
from krcg import vtes

vtes.VTES.load()


def main():
    all_references = {}
    multiple_references = {}
    all_rulings = {}
    for card in vtes.VTES:
        for ruling in card.rulings["text"]:
            ruling, references = _extract_references(ruling)
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
            all_rulings[f"{card.id}|{card._name}"].append(ruling)
    os.makedirs("output", exist_ok=True)
    with open("output/rulings.yaml", "w") as outf:
        yaml.dump(
            all_rulings,
            outf,
            width=120,
            allow_unicode=True,
        )
    with open("output/rulings_by_references.yaml", "w") as outf:
        yaml.dump(all_references, outf, width=120, allow_unicode=True)
    with open("output/multiple_references.yaml", "w") as outf:
        yaml.dump(multiple_references, outf, width=120, allow_unicode=True)
    with open("output/references.yaml", "w") as outf:
        yaml.dump(
            {k: v["link"] for k, v in all_references.items()},
            outf,
            width=120,
            allow_unicode=True,
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
