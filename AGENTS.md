# AGENTS.md

`vtes-rulings` is the official VTES rulings database (`rulings/rulings.yaml`,
`rulings/groups.yaml`, `rulings/references.yaml`), served at
[rulings.krcg.org](https://rulings.krcg.org). `CLAUDE.md` is a symlink to this
file.

See [README.md](README.md) for the file schema, card/symbol token syntax,
`[REMINDER]` entries, and group `overrides`.

## Writing rulings

- **Short and focused.** State the rule directly in one concise sentence where
  possible. Do not explain the reasoning ("since ..."), do not compare with
  other cards ("unlike ..."), and omit examples unless one `eg.` genuinely
  clarifies an abstract term (at most one or two cards, never a list of
  scenarios).
- **Extend before adding.** When a new source confirms or refines an existing
  ruling on the card or group, tighten the existing line and append the
  reference rather than adding a second bullet.
- **Single-line YAML.** Write each ruling as a single line under its key — do
  not wrap ruling strings across multiple lines (`.yamllint.yaml` allows up to
  256 characters). Quote a string only when YAML requires it (e.g. starts with
  `[` or `"` or contains `: `).
- **Keys and ordering.** Keep keys sorted in `en_US.UTF-8` order in all three
  YAML files (`yamllint` enforces `key-ordering`). Use `<card_id>|<printed_name>`
  for keys and `{<card_id>|<name>}` in text, adding the distinguishing suffix
  only when two cards share a name (e.g. `{200041|Alan Sovereign (ADV)}`).
- **References.** Add every cited `[AUTHOR YYYYMMDD]` (with `-1`, `-2` suffix
  when multiple posts share a date) to `rulings/references.yaml`: VEKN forum
  URLs with `#<post_id>` for forum posts, `https://usenet.krcg.org/t/<thread>/#m<n>`
  for newsgroup posts. Every reference in `references.yaml` (except `RBK`) must
  be used by at least one ruling.

## Checks

Tools come from `mise.toml` (`mise install`). Before committing:

- `uv run --frozen yamllint rulings`
- `uv run --frozen black --check scripts && uv run --frozen ruff check scripts`
- `uv run --frozen python scripts/check_rulings.py` (or `mise run test`)

Note: `mise run fmt` (`yamlfix`) wraps long lines; avoid running it on rulings
you want kept single-line.
