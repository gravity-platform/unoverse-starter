#!/usr/bin/env node
/**
 * unoverse lint — the rx/ definition linter.
 *
 * Runs the same rules the platform's schema + guard tests enforce, plus the
 * journey-doc conventions, as a standalone authoring-time check (no deps).
 * Errors fail (exit 1); warnings and hints inform. Every message cites the doc
 * that owns the rule (docs/design/ = the learning journey).
 *
 * Usage: node lint.mjs [path-to-rx]   (default: ./apps/unoverse/rx or ./rx)
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname, basename, resolve } from "node:path";

// ── ground truth (mirrors rx/_schema/unoverse.schema.json + server guard tests) ──
const PRIMITIVES = new Set([
  "Box", "Stack", "Row", "Column", "Each", "Switch", "ComponentSlot", "Timeline",
  "Text", "Image", "Button", "Input", "Markdown", "Skeleton", "Icon", "Ref",
]);
const CONDITION_KEYS = new Set(["field", "eq", "ne", "in"]);
// the portable style vocabulary — every key the SDK style interpreter maps
// (web: sdk/style.ts; each key is a neutral intent every native renderer — iOS,
// Android, RN, Flutter — must implement). An unknown key is ignored by every
// renderer, so it is always a typo or a web-ism: error either way.
const STYLE_KEYS = new Set([
  // dimensions & box
  "width", "height", "maxWidth", "minWidth", "minHeight", "maxHeight", "flex",
  "padding", "margin", "gap", "overflow",
  // position
  "position", "inset", "top", "right", "bottom", "left", "zIndex",
  // layout
  "direction", "wrap", "align", "justify", "display", "columns", "container", "hideBelow",
  // surface
  "background", "radial", "border", "borderTop", "borderRight", "borderBottom", "borderLeft",
  "outline", "shadow", "radius", "radiusTopLeft", "radiusTopRight", "radiusBottomLeft", "radiusBottomRight",
  // text & media
  "font", "weight", "lineHeight", "color", "textAlign", "fit",
  // motion & interaction
  "transform", "transition", "animation", "animationDelay", "cursor",
  // nested vocab
  "hover", "active", "when",
]);
// exact regex from server/src/runtime/definition-tokens.test.ts
const RAW_VALUE = /#[0-9a-fA-F]{3,8}\b|\b\d*\.?\d+(px|rem|em)\b/;
const NODE_KEYS_WITH_CHILD_NODES = ["children", "template", "fallback", "user", "assistant"];

// ── find the rx root ──
const arg = process.argv[2];
const candidates = arg ? [resolve(arg)] : [resolve("apps/unoverse/rx"), resolve("rx")];
const RX = candidates.find((p) => existsSync(join(p, "components")) || existsSync(join(p, "atoms")));
if (!RX) {
  console.error("unoverse lint: cannot find an rx/ folder (looked for: " + candidates.join(", ") + ")");
  process.exit(2);
}

const problems = []; // { level: "error"|"warn"|"hint", file, line?, msg }
const seen = new Set(); // envelopes pre-scan their states/-blocks/ partials, so dedupe
const report = (level, file, msg, line) => {
  const rel = relative(process.cwd(), file);
  const key = `${level}|${rel}|${line ?? ""}|${msg}`;
  if (seen.has(key)) return;
  seen.add(key);
  problems.push({ level, file: rel, line, msg });
};

// ── helpers ──
function jsonFiles(dir) {
  let out = [];
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    if (f.startsWith(".")) continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out = out.concat(jsonFiles(p));
    else if (f.endsWith(".json")) out.push(p);
  }
  return out;
}
const isFixture = (f) => f.endsWith(".states.json");
const isManifest = (f) => basename(f) === "manifest.json";

// atoms, case-insensitive by filename (the platform's lookup rule)
const atomsDirExists = existsSync(join(RX, "atoms"));
const atomNames = new Set(
  (existsSync(join(RX, "atoms")) ? readdirSync(join(RX, "atoms")) : [])
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, "").toLowerCase()),
);

// definition homes: shared components/atoms + each org's templates (same law everywhere)
const homes = [
  { dir: join(RX, "components"), kind: "component" },
  { dir: join(RX, "atoms"), kind: "atom" },
];
const orgsDir = join(RX, "orgs");
if (existsSync(orgsDir)) {
  for (const org of readdirSync(orgsDir)) {
    const t = join(orgsDir, org, "templates");
    if (existsSync(t) && statSync(t).isDirectory()) homes.push({ dir: t, kind: "template", org });
  }
}

// ── per-node structural walk ──
function checkCondition(vw, file, where) {
  if (typeof vw === "string") return;
  if (vw && typeof vw === "object" && !Array.isArray(vw)) {
    if (typeof vw.field !== "string")
      report("error", file, `${where}: condition needs a "field" (docs/design/04, the four moves)`);
    const extra = Object.keys(vw).filter((k) => !CONDITION_KEYS.has(k));
    if (extra.length)
      report("error", file,
        `${where}: illegal condition key(s) ${extra.join(", ")} — only eq/ne/in/truthy exist; no and/or/arithmetic. Derive in the node (docs/design/03)`);
    return;
  }
  report("error", file, `${where}: visibleWhen must be a field name or { field, eq|ne|in } (docs/design/04)`);
}

function walkNode(node, file, defFolder, ctx) {
  if (Array.isArray(node)) return node.forEach((n) => walkNode(n, file, defFolder, ctx));
  if (!node || typeof node !== "object") return;

  if (typeof node.$include === "string") {
    // resolved relative to the ROOT definition folder (schema rule)
    const target = join(defFolder, node.$include + ".json");
    const target2 = join(defFolder, node.$include); // already has .json
    if (!existsSync(target) && !existsSync(target2))
      report("error", file, `$include "${node.$include}" does not resolve under ${relative(process.cwd(), defFolder)}/ (docs/design/03)`);
    return; // included file is linted on its own
  }

  const t = node.type;
  if (typeof t !== "string") {
    report("error", file, `node without "type" (and no $include) — every node names a primitive (docs/design/02)`);
  } else if (!PRIMITIVES.has(t)) {
    report("error", file, `unknown primitive "${t}" — the set is closed; compose, don't invent (docs/design/02)`);
  }

  if (t === "Switch") {
    if (typeof node.on !== "string" || !node.cases || typeof node.cases !== "object")
      report("error", file, `Switch needs "on" (the discriminant field) + "cases" (docs/design/04)`);
    else
      for (const [caseKey, branch] of Object.entries(node.cases)) {
        const vw = branch && typeof branch === "object" ? branch.visibleWhen : undefined;
        const guarded = typeof vw === "string" ? vw : vw && typeof vw === "object" ? vw.field : null;
        if (guarded === node.on)
          report("error", file,
            `Switch on "${node.on}" → case "${caseKey}" re-guards its own discriminant — a layer never guards itself; delete the visibleWhen (docs/design/03)`);
      }
  }
  if (t === "Each") {
    if (!node.bind || typeof node.bind !== "object" || !node.template)
      report("error", file, `Each needs "bind": { "items": "<field>" } + "template" (docs/design/03)`);
  }
  if (t === "Ref") {
    if (typeof node.ref !== "string")
      report("error", file, `Ref needs "ref": "<atom name>" (docs/design/03)`);
    else if (atomsDirExists && !atomNames.has(node.ref.toLowerCase()))
      report("error", file, `Ref "${node.ref}" — no matching atom in rx/atoms/ (lookup is case-insensitive by filename)`);
  }
  if (t === "ComponentSlot") {
    if (!node.select || typeof node.select !== "object")
      report("error", file, `ComponentSlot needs "select" ({} for the conversation flow) (docs/design/05)`);
    else if (node.select.from === "all" && !node.select.type)
      report("warn", file,
        `global ComponentSlot (from:"all") without "type" — selects OLDEST-first; fine for a single-widget app shell, a trap in a multi-turn surface. Pin "type" unless the shell is deliberately catch-all (docs/design/05)`);
  }
  if ((t === "Switch" && !node.cases) || false) { /* covered above */ }

  if (node.visibleWhen !== undefined) checkCondition(node.visibleWhen, file, t || "node");
  // closed style-key vocabulary — the cross-platform contract (unknown keys never render)
  if (node.style && typeof node.style === "object") {
    const checkStyleKeys = (obj, where) => {
      for (const k of Object.keys(obj)) {
        if (!STYLE_KEYS.has(k))
          report("error", file,
            `${where}: unknown style key "${k}" — the style vocabulary is closed (the cross-platform contract every renderer implements). Typo, or a web-ism that won't port (docs/design/06)`);
        else if ((k === "hover" || k === "active") && obj[k] && typeof obj[k] === "object")
          checkStyleKeys(obj[k], `${where}.${k}`);
      }
    };
    checkStyleKeys(node.style, `${t}.style`);
    if (Array.isArray(node.style.when))
      for (const entry of node.style.when)
        if (entry && typeof entry === "object" && entry.apply && typeof entry.apply === "object")
          checkStyleKeys(entry.apply, `${t}.style.when.apply`);
  }
  // style.when = [{ field, eq|ne|in?, apply: {…} }, …]
  if (node.style && typeof node.style === "object" && node.style.when !== undefined) {
    const w = node.style.when;
    if (!Array.isArray(w))
      report("error", file, `${t}.style.when must be an array of { field, eq|ne|in, apply } entries (docs/design/04)`);
    else
      for (const entry of w) {
        if (!entry || typeof entry !== "object" || typeof entry.field !== "string" || !entry.apply)
          report("error", file, `${t}.style.when entry needs "field" + "apply" (docs/design/04)`);
        else {
          const extra = Object.keys(entry).filter((k) => !CONDITION_KEYS.has(k) && k !== "apply");
          if (extra.length)
            report("error", file, `${t}.style.when: illegal key(s) ${extra.join(", ")} — conditions are eq/ne/in/truthy only (docs/design/04)`);
        }
      }
  }

  // collect bound fields (bind is an object: targetProp → data field)
  if (node.bind && typeof node.bind === "object" && !ctx.inItemScope) {
    for (const field of Object.values(node.bind)) {
      if (typeof field === "string" && !field.includes("{{") && !field.includes("."))
        ctx.boundFields.add(field);
    }
  }

  // collect keys this definition writes itself via setValue (view state — not props)
  const collectWrites = (a) => {
    if (!a || typeof a !== "object") return;
    if (a.type === "setValue" && Array.isArray(a.values))
      for (const v of a.values) if (v && typeof v.key === "string") ctx.selfWritten.add(v.key);
    if (a.then) collectWrites(a.then);
  };
  if (node.action) collectWrites(node.action);

  // recurse — Each templates and Timeline user/assistant get item/turn scope (binds resolve there, not root props)
  for (const key of NODE_KEYS_WITH_CHILD_NODES) {
    if (node[key] === undefined) continue;
    const childCtx =
      (t === "Each" && key === "template") || (t === "Timeline" && (key === "user" || key === "assistant"))
        ? { ...ctx, inItemScope: true }
        : ctx;
    walkNode(node[key], file, defFolder, childCtx);
  }
  if (t === "Switch" && node.cases && typeof node.cases === "object")
    for (const branch of Object.values(node.cases)) walkNode(branch, file, defFolder, ctx);
}

// ── lint one file ──
function lintFile(file, home) {
  const src = readFileSync(file, "utf8");

  // LAW 1 — tokens only (same regex + line report as the platform guard; styles/ is never scanned)
  if (!isFixture(file) && !isManifest(file)) {
    src.split("\n").forEach((line, i) => {
      if (RAW_VALUE.test(line))
        report("error", file, `raw value — token names only; add/scale a token in the org styles instead (LAW 1, docs/design/06): ${line.trim()}`, i + 1);
    });
  }

  let json;
  try {
    json = JSON.parse(src);
  } catch (e) {
    report("error", file, `invalid JSON: ${e.message}`);
    return;
  }
  if (isFixture(file) || isManifest(file)) {
    if (isManifest(file)) {
      if (!(json.binding && json.binding.workflow))
        report("warn", file, `manifest has no binding.workflow — the app owns its workflow binding (docs/design/05)`);
      if (json.mode !== undefined && json.defaultState === undefined)
        report("warn", file, `"mode" was renamed to "defaultState" (the app's named default state on load, open name) — still read as a fallback, but rename it (docs/design/04)`);
      // dangling-name check: a declared non-template defaultState should be branched on
      // somewhere in this org's templates, or nothing will render differently for it
      const declared = json.defaultState ?? json.mode;
      if (declared && declared !== "template") {
        const orgTemplatesDir = dirname(dirname(file)); // orgs/<org>/templates
        const branched = jsonFiles(orgTemplatesDir).some(
          (f) => !isManifest(f) && !isFixture(f) && readFileSync(f, "utf8").includes('"defaultState"'),
        );
        if (!branched)
          report("hint", file, `declares defaultState "${declared}" but no template in this org branches on "defaultState" — the name will load but nothing renders differently for it (docs/design/04)`);
      }
    }
    return;
  }

  const isEnvelope = typeof json.unoverse === "string";
  const defFolder = dirname(file); // for bare partials in blocks/-states/ the ROOT def folder is one up
  const rootFolder = ["blocks", "states"].includes(basename(defFolder)) ? dirname(defFolder) : defFolder;

  if (isEnvelope) {
    for (const req of ["kind", "name", "root"])
      if (json[req] === undefined) report("error", file, `envelope missing "${req}" (docs/design/01)`);
    if (json.kind === "component") {
      for (const req of ["category", "description", "whenToUse"])
        if (!json[req])
          report("error", file, `component missing "${req}" — whenToUse is how the AI picks it; outcome-first, user vocabulary (docs/design/01)`);
    }
    if (json.kind && !["component", "template", "atom"].includes(json.kind))
      report("error", file, `unknown kind "${json.kind}"`);

    const ctx = { boundFields: new Set(), selfWritten: new Set(), inItemScope: false };
    if (json.root) walkNode(json.root, file, rootFolder, ctx);
    // view-state keys the definition writes itself (incl. in its states/ + blocks/ partials) aren't props
    for (const partial of jsonFiles(join(rootFolder, "states")).concat(jsonFiles(join(rootFolder, "blocks")))) {
      try {
        const sub = { boundFields: new Set(), selfWritten: ctx.selfWritten, inItemScope: true };
        walkNode(JSON.parse(readFileSync(partial, "utf8")), partial, rootFolder, sub);
      } catch { /* reported when the partial itself is linted */ }
    }

    // bind ⇒ prop with a default (root scope only; Each/Timeline scopes skipped; injected/derived flags reduce this to a warn)
    const props = json.props && typeof json.props === "object" ? json.props : {};
    for (const field of ctx.boundFields) {
      if (ctx.selfWritten.has(field)) continue;
      const p = props[field];
      if (p === undefined)
        report("warn", file, `bind reads "${field}" but props doesn't declare it — undeclared fields render blank until streamed (docs/design/03)`);
      else if (p && typeof p === "object" && p.default === undefined)
        report("warn", file, `prop "${field}" has no default — Studio mock renders it blank (docs/design/03)`);
    }

    // states/ folder hint — the folder IS Studio's state picker (LAYERS §7). Only worth a
    // hint when the definition actually has multiple layers (a Switch) but doesn't
    // enumerate them; a single-view component previews from its prop defaults.
    if (json.kind === "component" || json.kind === "template") {
      const hasSwitch = JSON.stringify(json.root ?? {}).includes('"Switch"');
      if (hasSwitch && !existsSync(join(rootFolder, "states")))
        report("hint", file, `has layers (Switch) but no states/ folder — the folder is Studio's state picker; enumerate the layers so every state is viewable in mock (docs/design/07)`);
    }
  } else {
    // bare node partial (blocks/, states/, atoms)
    walkNode(json, file, rootFolder, { boundFields: new Set(), selfWritten: new Set(), inItemScope: true });
  }
}

// ── run ──
for (const home of homes) for (const f of jsonFiles(home.dir)) lintFile(f, home);

const errors = problems.filter((p) => p.level === "error");
const warns = problems.filter((p) => p.level === "warn");
const hints = problems.filter((p) => p.level === "hint");
const icon = { error: "✗", warn: "⚠", hint: "·" };
for (const p of problems)
  console.log(`${icon[p.level]} ${p.file}${p.line ? ":" + p.line : ""}  ${p.msg}`);

console.log(
  `\nunoverse lint: ${errors.length} error(s), ${warns.length} warning(s), ${hints.length} hint(s) — ` +
    `${homes.map((h) => relative(process.cwd(), h.dir)).join(", ")}`,
);
process.exit(errors.length ? 1 : 0);
