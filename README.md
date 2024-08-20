# vtes-rulings

The official VTES rulings database.

## Design notes

The core principle of this project is to provide a curated list of rulings
**in a format that can withstand the passing of time**.

We have lost countless ressources to the passing decades because they were hosted in unmaintained databases
or in other impracticle formats.
With hindsight, the most resilient formats are the simplest time-tested text-based standards.
For example, the cards database, maintained in CSV format, or the TWD archive in plain HTML.

Here, we have opted for YAML, because it offers a more flexible structure than CSV (multiple rulings per card),
and is more readable than JSON, if anyone has to pick the project up without context in the future.

### Design principle

**The [rulings database](rulings/rulings.yaml) is a single self-sufficient YAML file.**
**It is usable with a text editor, without processing.**

### Design details

1. The rulings can contain disciplines and card types symbols in brackets (eg. `[pot]`), see the list below
2. The rulings can contain card names in braces (eg. `{Abbot}`)
3. Each ruling ends with one or more rulings reference IDs in brackets.
   References URLs are listed in the [references.yaml](rulings/references.yaml) file
4. Rulings are attached to a card, the format of the key is `<card_id>|<card_name>`, using the VEKN CSV cards IDs,
   or to group of cards, using the `<id>|<name>` format, with an ID beginning with `G`. Cards groups are listed in
   the [groups.yaml](rulings/groups.yaml) file.

#### List of symbols

- Inferior disciplines: abo, ani, aus, cel, chi, dai, dem, dom, for, mal, mel, myt, nec, obe, obf, obl, obt, pot, pre,
  pro, qui, san, ser, spi, str, tem, thn, tha, val, vic, vis
- Superior disciplines: ABO, ANI, AUS, CEL, CHI, DAI, DEM, DOM, FOR, MAL, MEL, MYT, NEC, OBE, OBF, OBL, OBT, POT, PRE,
  PRO, QUI, SAN, SER, SPI, STR, TEM, THN, THA, VAL, VIC, VIS
- Virtues: vin, def, jus, inn, mar, ven, red
- Card types: ACTION, POLITICAL, ALLY, RETAINER, EQUIPMENT, MODIFIER, REACTION, COMBAT, REFLEX, POWER
- Other: FLIGHT, MERGED, CONVICTION

Note the "Vision" virtue uses the `[vsn]` trigram, to avoid confusion with the "Visceratika" discipline `[vis]`.
Some versions of the VEKN CSV do use `[vis]` for both indistinctively.

### Discarded options

We discarded some options after careful consideration:

1. We could have used some **fields for the rulings** (separating symbol prefix, text, and references).
   Although a proper API _should_ present the rulings structure this way, the reference file must be kept as simple
   and readable as possible. The current structure _stays usable_ with very little post-treatment, which is better.
   Producing an alternative, more structured version, of the rulings, could be done by automated parsing.

2. We could have used **cards IDs only** and not bother with the cards name, but this would make this reference file
   unusable out of the box without the proper tooling. Such as it is, the file can be opened and a card searched for
   by name with just a text editor.

3. The **cards names** are the ones used in the VEKN CSV reference file. We could have opted for other alternatives,
   but we believe consistency with the existing reference is the stronger argument.
   Note different versions of the same vampires share the same name with different IDs (advanced, higher group).

## Scripts

To run the scripts, use a [Python3 virtual environment](https://docs.python.org/3/library/venv.html):

```bash
> python3 -m venv venv
> source venv/bin/activate
```

### Dump KRCG rulings

The [dump_krcg_rulings.py](scripts/dump_krcg_rulings.py) script dumps the legacy rulings from the krcg Python library.

```bash
> cd scripts
> pip install -r requirements.txt
> ./dump_krcg_rulings.py
```

## Website

### Develop / Run locally

Use a [Python3 virtual environment](https://docs.python.org/3/library/venv.html):

```bash
> python3 -m venv venv
> source venv/bin/activate
```

```windows
> python3 -m venv venv
> . .\venv\Scripts\activate
```

Install all the requirements:

```bash
> make update
```

```windows
pip install --upgrade --upgrade-strategy eager -e ".[dev]"
npm install --include=dev
```

Compile Typescript:

Make sure `node_modules/.bin` is in your `PATH` and run:

```
tsc
```

You can use the `-w` option to enable typescript live compiler while developing:

```
tsc -w
```

Run the website:

```
rulings-web
```
