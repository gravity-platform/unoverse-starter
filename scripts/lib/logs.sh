#!/usr/bin/env bash
# unoverse logs

cmd_logs() {
  local service="$1"
  if [ -n "$service" ]; then
    banner "Logs: $service"
    info "Press Ctrl+C to stop"
    echo ""
    docker compose -f "$ROOT/docker-compose.yml" logs -f --tail 100 "$service"
  else
    banner "Platform Logs"
    info "Press Ctrl+C to stop"
    info "Tip: ${BOLD}./unoverse logs server${NC} to filter by service"
    echo ""
    docker compose -f "$ROOT/docker-compose.yml" logs -f --tail 50
  fi
}
