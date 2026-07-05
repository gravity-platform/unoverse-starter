#!/usr/bin/env bash
# unoverse build + unoverse gendesign

cmd_build() {
  local package="$1"
  banner "Build & Restart"

  if [ -z "$package" ]; then
    echo "  Building all packages..."
    (cd "$ROOT" && npm run build)
    ok "All packages built"
  else
    echo "  Building $package..."
    (cd "$ROOT" && npm run build -w "$package")
    ok "$package built"
  fi

  echo "  Restarting services..."
  docker compose -f "$ROOT/docker-compose.yml" restart unoverse
  ok "Services restarted — changes are live"
  echo ""
}

cmd_gendesign() {
  banner "Generate Design System Nodes"
  fail "Retired: legacy design-system node generation is gone."
  info "Component nodes are authored in Unoverse (Studio nodegen) — see docs/unoverse/."
  echo ""
}
