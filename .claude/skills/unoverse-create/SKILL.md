---
name: unoverse-create
description: Create or edit Unoverse platform artifacts — UI components, templates, atoms and styles (rx/), agent skills and prompt blocks (prompts/), custom workflow nodes (nodes/), and workflows built live on the Canvas via the builder MCP. Use when the user wants to create, add, build, or modify a component, template, theme, agent skill, prompt block, custom node, or workflow in an Unoverse starter repo.
---

# Creating Unoverse Artifacts

You are helping a developer build in the **Unoverse developer carve-out** — the three
editable folders mounted into the running platform:

| Folder | What lives there |
|---|---|
| `apps/unoverse/rx/` | **Design** (data, not code): components, atoms, org-scoped templates + styles |
| `apps/unoverse/prompts/` | **Behavior**: agent skills (`skills/`) + prompt blocks (`blocks/`) |
| `apps/unoverse/nodes/` | **Logic**: custom workflow node packages (TypeScript) |

## Step 1 — Identify the artifact, read its playbook

Decide what the user is creating, then **read the matching reference file before writing
anything**:

| The user wants… | Read |
|---|---|
| A UI component or shared atom | `references/component.md` |
| A template / app layout (chat surface, wizard shell) | `references/template.md` |
| A style / theme / token change | `references/component.md` §Tokens |
| An agent skill (behavior guide the AI follows) | `references/agent-skill.md` |
| A prompt block (reusable prompt fragment) | `references/block.md` |
| A custom workflow node (integration, tool, logic) | `references/node.md` |
| A workflow (wire nodes into an agent/pipeline on the Canvas) | `references/workflow.md` |

Workflows are the one artifact that is NOT files: they are built live on the running
platform through the `unoverse-builder` MCP (registered by this repo's `.mcp.json`) —
the playbook covers the bind/build/test contract.

If it's ambiguous (e.g. "add a card that shows weather"), it's usually a **component**
(the UI) plus possibly a **node** (the data source) — confirm the scope with the user.

## Step 2 — Hard rules (apply to every artifact)

1. **Only edit the three carve-out folders.** Never touch, vendor, or work around the
   SDK, engine, or server — they are not yours to change. If a task seems to require an
   SDK change, the answer is almost always "express it as data" — re-read the playbook.
2. **Docs are the source of truth.** The playbooks point at `docs/unoverse/` and
   `docs/nodes/` in this repo. When the user's request goes beyond the playbook, read
   the pointed doc section — do not improvise conventions.
3. **UI is data.** No pixels, hex colors, or CSS anywhere — token names only. No logic
   in definitions — anything computed (totals, formatting, chosen colors) is computed in
   the node and sent as a plain field.
4. **Audit before you're done.** Every component/template must pass the conformance
   checklist (`docs/unoverse/UNOVERSE_AUTHORING.md` §9). Walk it item by item.

## Step 3 — Deploy loop (after the artifact is written)

| Artifact | To see it live |
|---|---|
| Component / atom / template / style | `./unoverse gendesign` — regenerates component nodes + restarts |
| Existing component restyle/edit only | takes effect live (SDK reads `rx/` directly) |
| Agent skill / prompt block | `docker compose restart unoverse` |
| Node | `./unoverse build @unoverse-platform/<pkg>` (or `./unoverse update nodes` for all) |

Verify with `./unoverse check` (services, node catalog, bundles). Preview components in
the Studio: set `UNOVERSE_WORKBENCH=1` on the `unoverse` service, open the API port.

> In the platform monorepo (not the starter), the node docs live at
> `docs-starter/nodes/` and the dev loop is `npm run dev` + `npm run nodegen:local`.
