# Playbook — Components & Atoms (rx data)

**Read first:** `docs/unoverse/UNOVERSE_AUTHORING.md` §1–§7 (mental model, envelope,
props/bind, walkthrough, composition, state, the four moves). This playbook is the
workflow; that doc is the law.

## Where files go

| Kind | Path |
|---|---|
| Component | `apps/unoverse/rx/components/<name>/<name>.json` (folder form unlocks `$include`) |
| Atom (shared partial) | `apps/unoverse/rx/atoms/<name>.json` |

The filesystem **is** the registry — drop the file in and it's discoverable. Lookup is
case-insensitive by filename.

## Workflow

1. **Study 2–3 existing components** in `rx/components/` closest in shape to the request
   (a card, a list, a wizard) before writing. Match their idioms exactly.
2. **Write the envelope**: `unoverse`, `kind`, `name`, `category`, `description`, and
   `whenToUse` (required for components — generic and selection-focused, never naming a
   specific agent or workflow).
3. **Declare every bound field in `props` with a `default`** (the mock the workbench
   renders). Mark **every workflow-fed field `input: true`** — marking only some
   silently breaks the others at runtime (they'll show their defaults forever).
4. **Build the tree** from the closed vocabulary only (AUTHORING §10):
   - Structural: `Box` `Stack` `Row` `Column` `Each` `Switch`
   - Leaves: `Text` `Image` `Button` `Input` `Markdown` `Skeleton` `Icon`
   - Helpers: `Ref` (atom), `$include` (sibling file)
   There is no Chart/Card/Loader leaf — compose them from `Box` + `Each` + data.
5. **State = a few shallow discriminants** (`step`, `displayState`), not boolean soup.
   The four moves: `visibleWhen` (small show/hide), `Switch` (whole-view swap),
   `Each` (repeat over data), `style.when` (same element restyles). Never clone an
   element under opposite `eq`/`ne` conditions just to change a style.
6. **Compose**: shared look → atom via `Ref`; alternate view → `$include` + `Switch`;
   repeated item → `Each`.

## Tokens (styles/themes)

Definitions own **zero raw values** — no `px`/`rem`/`#hex`. Token names only
(`"color": "text.primary"`, `"radius": "lg"`, space-scale sizes like `"width": "8"`).
Raw values live once in `apps/unoverse/rx/orgs/<org>/styles/` (`base/` scales →
`semantic/` + `themes/`); `rx/orgs/default/styles` is the default set and the starter
you copy for a new org. Need a missing value? Add/extend a token there and reference
it — never inline it. Never invent component-named tokens (`cardMin`, `tile`).

## Validate & ship

1. **Schema-check** the definition against `apps/unoverse/rx/_schema/unoverse.schema.json`
   (any JSON Schema validator, e.g. `npx ajv-cli validate -s rx/_schema/unoverse.schema.json -d <file> --strict=false`).
2. **Audit** against the conformance checklist — AUTHORING §9, every box.
3. `./unoverse gendesign` to (re)generate the component's node and restart; restyles of
   existing components take effect live.
4. Preview states in the Studio; a `*.states.json` fixture names useful state
   combinations (AUTHORING §12).
