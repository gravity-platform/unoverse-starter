#!/usr/bin/env bash
# unoverse new — scaffold a conformant rx/ artifact
#   ./unoverse new component <name>
#   ./unoverse new template <org> <name>

cmd_new() {
  if ! command -v node >/dev/null 2>&1; then
    echo "unoverse new requires Node.js 20+"; exit 1
  fi
  node "$GRAVITY_LIB/new.mjs" "$@"
}
