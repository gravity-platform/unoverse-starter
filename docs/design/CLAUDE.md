# Unoverse Design — Agent Rulebook

Condensed, non-negotiable rules for building Unoverse components and templates. Full journey: [README](./README.md), docs 01–09. Deep reference: `docs/unoverse/UNOVERSE_AUTHORING.md`, `UNOVERSE_STATE_MODEL.md`, `UNOVERSE_LAYERS.md`, `UNOVERSE_CONFORMANCE.md`.

---

## 1. The architecture in one paragraph

UI is **data**: neutral JSON definitions in `rx/`, rendered natively per platform by a **dumb, generic, style-free SDK**. Definitions are distributed as **MCP resources**; templates are **MCP Apps** whose `manifest.json` binds their workflow; user sends are `tools/call`, wizard answers are MCP elicitations; run-scoped UI state arrives on the MCP `/stream`. You author data; you never touch the SDK, the transport, or platform code.

## 2. Where files go

| Artifact | Path |
|---|---|
| Component | `rx/components/<name>/<name>.json` (prop defaults = the Studio mock) |
| Atom (shared partial) | `rx/atoms/<name>.json` (bare node, no envelope) |
| Template + manifest | `rx/orgs/<org>/templates/<name>/{<name>.json, manifest.json}` |
| Tokens/themes | `rx/orgs/<org>/styles/{base,semantic,themes}/` |
| Earned extractions | `blocks/` (shape reused by 2+ states), `states/` (repeated/large layers) — `$include`, bare nodes |

## 3. Component envelope template

```jsonc
{
  "unoverse": "1.0", "kind": "component", "name": "MyCard",
  "category": "…", "description": "…",
  "whenToUse": "Outcome-first, user vocabulary. Disqualify by property, never by naming siblings/agents.",
  "props": { "title": { "type": "string", "default": "" } },   // EVERY bind has a prop WITH a default
  "root": { "type": "Box", "style": { "padding": "4", "background": "surface.base" }, "children": [ … ] }
}
```

## 4. Non-negotiable rules

1. **Closed primitive set** — `Box Stack Row Column Each Switch ComponentSlot Timeline · Text Image Button Input Markdown Skeleton Icon · Ref $include`. Conditions: `eq ne in` truthy only. Never invent a primitive; compose.
2. **LAW 1: zero raw values** — no `px/rem/em/#hex` in any definition; **semantic** token names only; no invented component-named tokens. Style KEYS are closed too (the cross-platform contract — no web-isms like `backdropFilter`; lint + schema enforce, incl. inside `hover`/`when.apply`).
3. **Two writes only** — `setValue` (component's own slice) + `setTemplateValue` (template state). All UI features are dev-named KEYS, never new verbs/buckets. Focus = `setValue {defaultState}` (widget's own look) + `setTemplateValue {defaultState:"focus"}` (screen-wide signal). `defaultState` = the app's named state (manifest declares the load default; OPEN name set); the template defines its own surface per name.
4. **Locked state is read-only** — conversation/turn lifecycle (project derived `isStreaming`/`isEmpty`; never simulate or gate on text); voice (SDK service owns audio; you branch a `Switch` on the projected template-state `callState`: `idle|active|agentSpeaking|userSpeaking`; transcript rides `Timeline`); native host chrome (host `useState` → `props`, never the store, never a new primitive).
5. **Derived values in the node** — no arithmetic/logic in definitions; the workflow sends plain fields.
6. **No component-type rules in templates** — one generic `ComponentSlot select: {}` in the flow; global slots MUST pin `type` (oldest-first trap); a component owns its size in its own definition.
7. **Extraction is earned** — defining states stay in the root; a `Switch` case never re-checks its own discriminant; one discriminant per axis, no boolean soup.
8. **Never hand-roll transport** — no bespoke REST/user_action; the SDK's MCP path is the only one.

## 5. Workflow checklist

1. Read the matching journey doc before authoring ([03](./03-components.md) component / [05](./05-templates.md) template / [06](./06-styles-and-tokens.md) styles).
2. Scaffold: `./unoverse new component <name>` / `./unoverse new template <org> <name>` — the output passes lint; fill the TODOs.
3. Make prop defaults realistic (they ARE the Studio mock). Multi-layer definitions enumerate each layer as `states/<layer>.json` — the folder IS Studio's state picker AND the served manifest's state list; add a state = add a file, nothing to register.
4. Validate: `./unoverse lint` (schema + token law + state rules, doc-cited messages, [08](./08-validate-and-ship.md)). Must be 0 errors; justify any warning.
5. Audit against the conformance checklist ([08](./08-validate-and-ship.md) Layer 3) — do this explicitly, it covers what linters can't.
6. Deploy: `./unoverse gendesign`, then `./unoverse check`.
7. Verify in **Studio**: mock states, then **live mode** (real workflow streams real data — the release test). Debug order: stream log → state inspector → definition. Never edit on a guess.

## 6. Error → fix quick table

| Symptom | Fix |
|---|---|
| Blank render while data streams | `bind` ≠ streamed key, or missing default — read the stream log first |
| `visibleWhen` never fires | wrong bucket: align `setValue`/`setTemplateValue` with where you read ([04](./04-state.md) table) |
| Focus won't close | `defaultState` is TEMPLATE state — `setTemplateValue { defaultState: null }` |
| Focus panel shows stale component | pin `type` on the global slot |
| Thinking dots never stop | `WORKFLOW_COMPLETED` missing on the stream — report; never patch in the definition |
| Style ignored | raw value or nonexistent token — check `styles/semantic/` |
| Edit does nothing | node contract changed → `./unoverse gendesign` |
| AI never picks it | rewrite `whenToUse` outcome-first |

Full table: [09 — Troubleshooting](./09-troubleshooting.md).
