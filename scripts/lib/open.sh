#!/usr/bin/env bash
# gravity open

cmd_open() {
  local target="${1:-canvas}"
  local url

  case "$target" in
    canvas)  url="http://localhost:3001" ;;
    api)     url="http://localhost:4100" ;;
    *)
      fail "Unknown target: $target"
      info "Options: canvas, api"
      return
      ;;
  esac

  ok "Opening $target → ${UNDERLINE}$url${NC}"

  # Cross-platform open
  if command -v open &>/dev/null; then
    open "$url"
  elif command -v xdg-open &>/dev/null; then
    xdg-open "$url"
  else
    info "Open in your browser: $url"
  fi
}
