# Playbook — Templates (app layouts)

**Read first:** `docs/unoverse/UNOVERSE_AUTHORING.md` §8 (templates + manifest),
`docs/unoverse/UNOVERSE_LAYERS.md` (the blocks/ + states/ structure — the shape of every
non-trivial template), and `docs/unoverse/UNOVERSE_STATE_MODEL.md` (the 3 state buckets,
focus/mode). Everything in the component playbook (closed vocabulary, tokens,
conformance) applies here too.

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

## Where files go — the anatomy

Templates are **org-scoped**. A rich template follows the LAYERS structure exactly:

```
apps/unoverse/rx/orgs/<org>/templates/<name>/
  <name>.json        # ROOT — the selector: Switch on the discriminant + always-on shell
  manifest.json      # the app contract (binding, type, …)
  states/            # one thin file per LAYER (welcome, conversation, focus…)
  blocks/            # shared shapes (header, user-turn, composer-bar…) — see rule below
```

The LAYERS rules that keep this honest (full reasoning: UNOVERSE_LAYERS.md §2–§3):

- **Root = the design.** `<name>.json` is the `Switch` on the state discriminant plus
  any always-on shell. Identity lives here, not scattered.
- **A state = blocks + data.** A `states/` file only composes blocks (via `$include`)
  and binds that layer's fields — no shape code duplicated into it.
- **A block is earned by reuse.** Extract to `blocks/` ONLY when 2+ states share the
  shape; a single-state shape stays inline in that state.
- **A layer never guards itself.** The root `Switch` decides which layer shows; a state
  file must not re-check its own discriminant with `visibleWhen`.
- **New states are earned by a different arrangement of blocks** — same blocks, same
  fields, different values is ONE data-driven state, not a new file.

A trivial template (single fixed layout) can be just `<name>.json` + `manifest.json`.

**Study an existing template first** — pick the org template closest to your shape under
`rx/orgs/*/templates/` and mirror its folder layout exactly.

## New org?

An org is just a folder: `rx/orgs/<org>/` with `templates/` and a **complete,
self-contained** `styles/`. Create one by copying the starter token set
`rx/orgs/default/styles` → `rx/orgs/<org>/styles` and re-valuing the base scales for the
brand. There is no fallback and no overlay — every org carries its full style set. The
org folder name becomes the address: apps are `unoverse://apps/<org>/<name>`, themes are
`unoverse://theme/<org>/<theme>` (e.g. `<org>/light`).

## manifest.json (the app contract)

Required: explicit **`type`** (`"template"` = swaps the whole surface · `"component"` =
streams into the current chat history) and **`binding`** (`workflow` + `trigger`).

- `binding.workflow` is the id of the workflow this app fires (`wf-…` — from the
  workflow's page on the Canvas); `binding.trigger` is the id of that workflow's
  trigger node. The app **owns** its workflow — a template without a real, working
  workflow binding is not done.
- `autoTrigger` matches the mode (component apps usually `true`; template apps wait for
  the user).
- Height is derived from `type` — only set `fluidHeight` to override.
  `previewComponents` is a hint, never a gate.

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

1. Schema-check every file — the envelope AND each bare-node partial in `blocks/` and
   `states/` validate against `rx/_schema/unoverse.schema.json`.
2. Audit: AUTHORING §9 — especially the **Templates only** section (slots pin type,
   manifest has explicit `type` + `binding`) and the sizing rule (a focused/full layer
   caps its height and scrolls its body only — LAYERS §4b).
3. `./unoverse gendesign` to regenerate + restart.
4. **See it**: open the Studio (`UNOVERSE_WORKBENCH=1` on the `unoverse` service) —
   Mock mode renders the template from prop defaults, and the state picker walks its
   layers. Then run it for real: trigger the app from its channel and verify the bound
   workflow streams components into the slots end-to-end.
