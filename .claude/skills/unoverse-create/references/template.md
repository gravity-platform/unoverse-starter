# Playbook — Templates (app layouts)

**Read first:** `docs/unoverse/UNOVERSE_AUTHORING.md` §8 (templates + manifest),
`docs/unoverse/UNOVERSE_STATE_MODEL.md` (the 3 state buckets, focus/mode), and
`docs/unoverse/UNOVERSE_LAYERS.md` (blocks/ + states/ structure, sizing). Everything in
the component playbook (closed vocabulary, tokens, conformance) applies here too.

## Where files go

Templates are **org-scoped**:

```
apps/unoverse/rx/orgs/<org>/templates/<name>/
  <name>.json        # the template definition (envelope kind: "template")
  manifest.json      # binds it to a workflow, declares its mode
  *.json             # $include partials (user-turn, assistant-turn, panels…)
```

Study an existing org's templates before writing; copy the folder shape exactly.

## What a template is

The **layout shell** — it places where streamed components and the conversation go. It
owns **nothing**: conversation data and component data live in the shared store, so
templates are swappable mid-conversation. Two template-only primitives:

- **`ComponentSlot`** — pulls components from the store by type
  (`select: { type, from: "latest"|"all", limit }`, plus `fallback`).
  ⚠ Selection is timeline-ordered **oldest first** — every `from: "all"` slot MUST pin
  `type`, or it shows the conversation's first-ever component forever.
- **`Timeline`** — renders the conversation; you supply the `user` and `assistant` turn
  subtrees. Per-turn scope: `text`, `time`, `streaming`, `empty`, `active`, plus
  `assistantData`/`userData` extras.

## manifest.json (the app contract)

Required: explicit **`type`** (`"template"` = swaps the whole surface · `"component"` =
streams into the current chat history) and **`binding`** (`workflow` + `trigger`).
`autoTrigger` matches the mode (component apps usually `true`). Height is derived from
`type` — only set `fluidHeight` to override. `previewComponents` is a hint, never a gate.
See AUTHORING §8 for the full annotated example.

## State rules

- Template's own bag (`setTemplateValue`): dev-named keys like `openPanel`, `mode`.
- Screen-wide "focus" is **not an SDK concept** — it's a template-state key (`mode`),
  and each template renders its own focus surface by branching on it (`Switch` or
  `visibleWhen`). A widget's own inline↔focused look is component state
  (`displayState` via `setValue`), never the template's.
- Ephemeral UI chrome (an open FAQ, a tab) that belongs to the host app stays in the
  **channel** (host props), projected via `visibleWhen` — not in the store.
- Conditions read fields; they never compute. Derived values come from the node.

## Validate & ship

1. Schema-check every file (envelope + bare-node partials both validate against
   `rx/_schema/unoverse.schema.json`).
2. Audit: AUTHORING §9 — especially the **Templates only** section (slots pin type,
   manifest has explicit `type` + `binding`), and the sizing rule (focused/full layers
   cap height and scroll their body only).
3. `./unoverse gendesign`, then exercise the app end-to-end in its channel.
