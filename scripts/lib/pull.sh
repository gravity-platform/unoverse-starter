#!/usr/bin/env bash
# gravity pull

cmd_pull() {
  echo ""
  read -r -p "  Pull platform images now? (~1.2GB first time) [Y/n] " REPLY
  echo ""
  if [[ "$REPLY" =~ ^[Nn]$ ]]; then
    info "Skipped. Run ${BOLD}./gravity start${NC} later."
    return
  fi

  local IMAGES=(
    "registry.digitalocean.com/gravity-repo/gravity-server:latest"
    "registry.digitalocean.com/gravity-repo/gravity-workflow:latest"
    "registry.digitalocean.com/gravity-repo/gravity-canvas:latest"
    "registry.digitalocean.com/gravity-repo/gravity-umap:latest"
    "registry.digitalocean.com/gravity-repo/gravity-node-service:latest"
    "registry.digitalocean.com/gravity-repo/gravity-mcp-server:latest"
    "registry.digitalocean.com/gravity-repo/gravity-memory:latest"
  )

  local total=${#IMAGES[@]}
  local count=0
  local failed=0

  local spin='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'

  echo ""
  for img in "${IMAGES[@]}"; do
    ((count++))
    local short="${img##*/}"          # gravity-server:latest
    short="${short%%:*}"              # gravity-server

    # Start pull in background
    docker pull "$img" &>/dev/null &
    local pid=$!

    # Animate spinner while pulling
    local i=0
    while kill -0 "$pid" 2>/dev/null; do
      local c="${spin:i++%${#spin}:1}"
      printf "\r  ${DIM}[%d/%d]${NC} ${CYAN}%s${NC} Pulling ${BOLD}%s${NC} " "$count" "$total" "$c" "$short"
      sleep 0.1
    done

    # Check result
    wait "$pid" 2>/dev/null
    if [ $? -eq 0 ]; then
      printf "\r  ${DIM}[%d/%d]${NC} ${GREEN}✓${NC} Pulling ${BOLD}%s${NC} \n" "$count" "$total" "$short"
    else
      printf "\r  ${DIM}[%d/%d]${NC} ${RED}✗${NC} Pulling ${BOLD}%s${NC} \n" "$count" "$total" "$short"
      ((failed++))
    fi
  done
  echo ""

  # Count how many gravity images we have now
  local pulled
  pulled=$(docker images -a --format "{{.Repository}}" | grep -c "gravity-repo" || true)
  pulled=$(echo "$pulled" | tr -d '[:space:]')
  pulled=${pulled:-0}

  echo ""
  if [ "$pulled" -ge 6 ]; then
    ok "All $pulled images pulled"
  elif [ "$pulled" -gt 0 ]; then
    warn "$pulled images pulled (some may need retry)"
    info "Run ${BOLD}gravity pull${NC} to retry"
  else
    fail "No images pulled — check your DOCR token and network"
    exit 1
  fi
}
