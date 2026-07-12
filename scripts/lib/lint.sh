#!/usr/bin/env bash
# unoverse lint — rx/ definition linter (schema + guard rules, authoring-time)

cmd_lint() {
  if ! command -v node >/dev/null 2>&1; then
    echo "unoverse lint requires Node.js 20+"; exit 1
  fi
  node "$GRAVITY_LIB/lint.mjs" "${1:-$ROOT/apps/unoverse/rx}"
}
