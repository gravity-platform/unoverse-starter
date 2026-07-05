# Unoverse — Conformance (how the rules are enforced)

> **Status**: 🟢 Schema live + validated (July 2026); semantic test = next.
> **Audience**: anyone authoring `rx/**` definitions, or maintaining the guards.
> **Companions**: [`UNOVERSE_AUTHORING.md`](./UNOVERSE_AUTHORING.md) (the rules),
> [`UNOVERSE_LAYERS.md`](./UNOVERSE_LAYERS.md) (blocks/states), [`UNOVERSE_STATE_MODEL.md`](./UNOVERSE_STATE_MODEL.md).
>
> **One line:** the framework has a lot of prose rules; we turn the *machine-checkable* ones into
> **build-/editor-failing guards** so a new dev is caught early, and we're honest that the
> **judgment** ones can't be a guard.

---

## 1. The principle — prose rule → machine guard

Every rule that can be checked mechanically should be a guard, not tribal knowledge. But a guard
that **false-positives is worse than none** — one wrong red squiggle and people disable it and
stop trusting the suite. So the bar is: **zero false positives on valid definitions**, and only
**hard-fail the unambiguous rules** — everything judgment-y is a hint or a human's call.

There are three layers, by *when* they catch you:

| Layer | When | Catches | Where |
|---|---|---|---|
| **JSON Schema** | **as you type** (editor) | shape rules — vocabulary, envelope, primitive completeness, condition form | `rx/_schema/unoverse.schema.json` |
| **Guard tests** | on `npm test` / CI | textual + (next) cross-file/semantic rules | `server/src/runtime/*.test.ts` |
| **SDK closed-set** | on SDK build | the primitive set itself is frozen | `unoverse/react/test/closed-set.test.mjs` |

---

## 2. The JSON Schema (editor guidance — the biggest win for new devs)

**File:** `apps/unoverse/rx/_schema/unoverse.schema.json`
**Wired in:** `.vscode/settings.json` → `json.schemas`, matched against
`rx/{components,templates,atoms}/**/*.json` (manifests + `_schema/` excluded).

Editing a definition in VS Code now gives, **inline, before you ever run anything**:

- **Autocomplete of the 16 primitives** (`type:` → `Box`/`Switch`/`Each`/…).
- **Errors on**: an invalid `type`; a missing envelope field (a `component` without
  `whenToUse`/`category`/`description`); a broken `Switch` (no `cases`), `Each` (no `template`),
  `Ref` (no `ref`), or `ComponentSlot` (no `select`); a bad `visibleWhen` (`and`/`or`/arithmetic —
  only `eq`/`ne`/`in`/truthy).
- Hover text pointing at the rule (LAW 1, §7, §10, layers §3).

**How it stays correct:**
- **One schema, two shapes.** A file with `unoverse` validates as an **envelope**; a bare-node
  partial (`blocks/`, `states/`, `$include` siblings) validates as a **node** — routed by
  `if/then/else` on `unoverse`.
- **Structural, never textual.** It only constrains *node positions* (`root`, `children`,
  `cases`, `template`, `fallback`, `user`/`assistant`). `style` / `bind` / `props` / `action` are
  **freeform**, so a data value like `type: "domestic"`, an `action.type: "setValue"`, or a
  `select.type: ["ProductFinder"]` is **never** mistaken for a node type. This is why it has zero
  false positives where a naive text scan would drown in them.

**Verified (the bar):** validated against **all 54** existing definitions → **54/54 clean**, and
it **catches all** planted mistakes (bad type, missing `cases`/`template`/`ref`/`select`,
`and`/`or` condition, component missing `whenToUse`). If you add a check, re-run the validation
below and keep it at 0 false positives.

```bash
# from apps/unoverse — validate the schema against every real definition
node -e 'const A=require("../../node_modules/ajv");const fs=require("fs"),p=require("path");
const v=new A({allErrors:true,strict:false}).compile(JSON.parse(fs.readFileSync("rx/_schema/unoverse.schema.json")));
const w=d=>fs.readdirSync(d).flatMap(f=>{const q=p.join(d,f);return fs.statSync(q).isDirectory()?w(q):(f.endsWith(".json")&&f!=="manifest.json"?[q]:[])});
let bad=0;for(const d of["rx/components","rx/templates","rx/atoms"])for(const f of w(d))if(!v(JSON.parse(fs.readFileSync(f)))){bad++;console.log("✗",f,v.errors[0].instancePath,v.errors[0].message)}
console.log(bad?`${bad} FALSE POSITIVES — loosen the schema`:"clean ✓")'
```

---

## 3. The guard tests (CI backstop)

Run by `npm test` (`apps/unoverse` → `server/src/runtime/*.test.ts`).

- **`definition-tokens.test.ts`** *(live)* — definitions reference **tokens**, never raw
  `px`/`rem`/`#hex` (LAW 1). Styling literals live only in `rx/styles`.
- **conformance test** *(next)* — the rules the schema **can't** see, because they need the
  **composed tree** (post-`$include`/`Ref`) and **scope**:
  - **`$include` / `Ref` resolution** — every include path + atom ref actually resolves (a real
    bug caught cheaply — it bit us migrating the chat).
  - **layer self-guards** — a `Switch` case that re-checks its own discriminant
    (`visibleWhen: {field:"step", eq:"income"}` inside `cases.income`) — the "a layer never guards
    itself" rule (`UNOVERSE_LAYERS.md` §3). *Warning.*
  - **bind ⇒ prop+default** — done **scope-aware** (an `Each`-item / `Timeline`-turn /
    `ComponentSlot` / `Ref`-remapped bind resolves against *that* scope, not the def props) —
    otherwise it false-positives on hundreds of valid binds. Catches the silent
    "workbench shows nothing" failure.

---

## 4. What a guard can NOT check — be honest

These are **judgment calls**; a linter that pretends to check them just trains people to ignore
warnings. They stay in the docs + code review:

- **"the root is the design"** — extract for reuse/repetition, don't scatter identity (layers §3a).
- **"few shallow discriminants, not boolean soup"** (authoring §9).
- **"derived values computed in the node, not the template"** (authoring §9).
- **"same-shape states should collapse to one data-driven state"** — detectable *heuristically*
  (identical block trees), but the call to merge is a human's.

---

## 5. Maintenance — avoid drift

- **Name the rule.** Each check points at its doc section; when a rule changes, both move.
- **One source for the closed set.** The primitive list lives in the SDK's `closed-set.test.mjs`
  *and* the schema `type` enum. Keep them equal — if you add a primitive (an SDK change), update
  both, or they disagree silently.
- **Never trade a false positive for a catch.** The schema/test is only trusted while 0/‑N valid
  files pass. Re-run §2's validation after any change.
