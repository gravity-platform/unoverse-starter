# 03 — Components

**Props are the contract, atoms are the reuse, extraction is earned.**

---

## 📁 Where things live

```
rx/
├── atoms/                        # shared partials, usable by any definition via Ref
│   └── close-button.json
├── components/
│   └── bookingwizard/
│       ├── bookingwizard.json    # the definition (envelope)
│       ├── states/               # the layer files — ALSO Studio's state picker + the served state list
│       │                         #   (extraction still EARNED: single-view components need none)
│       └── blocks/               # EARNED: shapes reused by 2+ states
└── orgs/<org>/                   # templates + styles — see 05 and 06
```

- File lookup is case-insensitive by filename; the `name` field is the display/type name.
- Simple components can be a single file `rx/components/<name>.json`; the folder form unlocks `$include`.

---

## 🔗 Props & `bind` — the data contract

`props` declares **every field the definition reads**, each with a default. `bind` connects a leaf to a field.

```jsonc
"props": {
  "items":  { "type": "array",  "default": [] },
  "status": { "type": "string", "default": "idle" }
}
```

Rules:

- ✅ **Every `bind` resolves to a prop (or a state key you set) with a default.** A missing default renders as blank and looks like a streaming bug.
- ✅ **Derived values are computed in the node, not the definition.** Totals, formatted currency, is-active flags — the workflow sends them as plain fields. Conditions are read-only (`eq`/`ne`/`in`/truthy); there is no arithmetic in definitions, on purpose.
- ❌ Never bind to a field the workflow "probably" sends — declare it.

---

## 🧩 Composition — three tools

### `Ref` — use an atom

Atoms are shared partials in `rx/atoms/`. Reference by filename (case-insensitive); `props` remaps the atom's fields to your data:

```jsonc
{ "type": "Ref", "ref": "Button", "visibleWhen": "callToAction",
  "props": { "label": "callToAction" } }
```

Build an atom when the same piece appears in **multiple definitions** (a close button, an avatar row). An atom is a bare node file — no envelope.

### `$include` — split a big file

Inside a component folder, pull in a sibling subtree:

```jsonc
{ "$include": "blocks/header" }
```

Included files are **bare nodes** (no `unoverse` field) in `blocks/` or `states/`.

### `Each` — repeat over data

```jsonc
{ "type": "Each", "bind": { "items": "items" },
  "style": { "direction": "column", "gap": "3", "width": "full" },
  "template": {
    "type": "Row", "style": { "gap": "3", "padding": "2" },
    "children": [
      { "type": "Text", "bind": { "value": "label" } },
      { "type": "Text", "bind": { "value": "value" }, "style": { "color": "text.primary" } }
    ]
  } }
```

Inside the `template`, `bind` resolves against **each item**, not the root props.

---

## 🪓 Extraction is EARNED — don't pre-split

The most common structural mistake is scattering a component across many small files "for cleanliness". The rules:

| Pull into… | Only when… |
|---|---|
| `blocks/` | a shape is **reused by 2+ states** |
| `states/` | a layer is **repeated** (many sibling variants) or **large and independent** |
| `rx/atoms/` | the piece is reused by **2+ definitions** |

✅ **A design's few defining states stay in the root** — they ARE the design. A widget whose whole identity is `inline ↔ focused` keeps both in its root `Switch`; extracting them hides the design from the reader.

---

## 📐 A component owns its size

A component has a **natural, fit-to-content width/height** declared in its own definition (`nodeSize`, its root styles). The template frames it; it never force-fills the template.

- ✅ Want a component full-width? Set that **in its definition**.
- ❌ Never add per-component sizing rules to a template ("if it's a ProductCard, stretch it") — hardcoded type rules in templates are forbidden and brittle.

---

## 🧭 View states live IN the component

A component's own view state — active tab, wizard step, expanded/collapsed — is **its own state slice**, written by its own buttons via `setValue` and read via `Switch`/`visibleWhen`. That's the subject of the next doc, and it's the one to internalize before writing anything interactive.

```jsonc
{ "type": "Switch", "on": "step",
  "cases": {
    "choose":  { "$include": "states/choose" },
    "confirm": { "$include": "states/confirm" },
    "done":    { "$include": "states/done" }
  } }
```

⚠️ **A state never guards itself.** Inside `cases.confirm`, do NOT add `visibleWhen: { field: "step", eq: "confirm" }` — the `Switch` already did that. Double-guarding is a conformance warning.

---

**Next:** [04 — State](./04-state.md) — the three buckets, the two writes, and what's locked.
