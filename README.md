# vtes-rulings

The official VTES rulings database.
Check the **[Rulings website](https://rulings.krcg.org)** for a searchable online version

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
2. The rulings can contain cards in braces, in the same `<card_id>|<card_name>` form as the keys
   (eg. `{100006|Abbot}`), using the VEKN CSV cards IDs. A brace names a card inside a sentence, so
   its name carries the suffix telling two same-named cards apart (`{200041|Alan Sovereign (ADV)}`,
   where the key is `200041|Alan Sovereign`)
3. A ruling usually ends with one or more rulings reference IDs in brackets (eg. `[LSJ 20040518]`).
   References URLs are listed in the [references.yaml](rulings/references.yaml) file.
   Reminder rulings (see below) are the exception and may carry no reference.
4. Rulings are attached to a card, the format of the key is `<card_id>|<card_name>`, using the VEKN CSV cards IDs,
   or to group of cards, using the `<id>|<name>` format, with an ID beginning with `G`. Cards groups are listed in
   the [groups.yaml](rulings/groups.yaml) file.

#### Reminders

A **reminder** merely restates official card text or a core rule; it is not a genuine ruling and needs
no discussion. It is written like any ruling but ends with a trailing `[REMINDER]` tag, and may omit any
reference. The tag is just a text marker at the end of the ruling:

```yaml
100015|Academic Hunting Ground:
  - A copy in play prevents playing another with the same title. [LSJ 20040518]
  - It provides the master phase action it is played with. [REMINDER]
```

#### Overrides

A group ruling sometimes needs different wording for a few of the cards in the group. Such a ruling is
written as a map instead of a plain string: a `text` key with the default wording, and an `overrides`
map keyed by `<card_id>|<card_name>` giving the replacement wording for those cards. This map form is
used **only** for overrides:

```yaml
G00008|Permanent not replaced:
  - text: The permanent is not replaced. [LSJ 20040518]
    overrides:
      100015|Academic Hunting Ground: The hunting ground is not replaced. [LSJ 20040518]
```

The default `text` follows the usual ruling conventions, so it ends with a trailing `[REMINDER]` tag
when the ruling is itself a reminder (reminders and overrides are independent).

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
   by name with just a text editor. This is why both the keys and the braces carry the two together.

3. The **cards names** were the ones used in the VEKN CSV reference file, for consistency with the existing
   reference. They are now the names as printed on the cards: the CSV files the article to the end, `Ankou, The`,
   and the cards do not. The ID beside each name is what identifies the card, so a name here is free to read the
   way the card does, and to be rewritten whenever the card data restyles it.
   Note different versions of the same vampires share the same name with different IDs (advanced, higher group).

## Scripts

To run the scripts, use a [Python3 virtual environment](https://docs.python.org/3/library/venv.html):

```bash
> python3 -m venv .venv
> source .venv/bin/activate
> pip install -e "."
```

### Rulings format and consistency

Run

```bash
> yamlfix rulings/*.yaml
```

to format the `YAML` files cleanly, and

```bash
> yamllint rulings
```

to check the formatting. Additionally, you can use

```bash
> python scripts/check_rulings.py
```

to check the rulings files consistency in more depth.
If you have `make`, you can run all checks easily with

```bash
> make test
```
