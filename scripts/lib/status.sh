#!/usr/bin/env bash
# gravity status

cmd_status() {
  banner "Platform Status"
  echo ""

  local output
  output=$(docker compose -f "$ROOT/docker-compose.yml" ps -a --format "{{.Name}}\t{{.Status}}" 2>/dev/null) || true

  if [ -z "$output" ]; then
    info "No services found. Run ${BOLD}./gravity start${NC}"
    echo ""
    return
  fi

  printf "  ${DIM}%-32s %s${NC}\n" "Service" "Status"
  echo -e "  ${DIM}───────────────────────────────────────────${NC}"

  while IFS=$'\t' read -r name status; do
    if echo "$status" | grep -qi "up"; then
      echo -e "  ${GREEN}●${NC} $(printf '%-30s' "$name") ${GREEN}${status}${NC}"
    elif echo "$status" | grep -qi "created"; then
      echo -e "  ${YELLOW}●${NC} $(printf '%-30s' "$name") ${YELLOW}${status} (never started)${NC}"
    else
      echo -e "  ${RED}●${NC} $(printf '%-30s' "$name") ${RED}${status}${NC}"
    fi
  done <<< "$output"

  echo ""
}
