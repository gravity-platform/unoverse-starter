#!/usr/bin/env bash
# Shared colors, helpers, and constants

GRAVITY_VERSION="1.0.0"
DOCR_REGISTRY="registry.digitalocean.com"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
UNDERLINE='\033[4m'

ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }
info() { echo -e "  ${DIM}$1${NC}"; }
link() { echo -e "  ${CYAN}${UNDERLINE}$1${NC}"; }
banner() {
  echo ""
  echo -e "  ${BOLD}${CYAN}⬡ $1${NC}"
  echo -e "  ${DIM}─────────────────────────────────${NC}"
}

# Elapsed time helper
timer_start() { GRAVITY_START=$(date +%s); }
timer_elapsed() {
  local end=$(date +%s)
  local elapsed=$((end - GRAVITY_START))
  if [ $elapsed -ge 60 ]; then
    echo "$((elapsed / 60))m $((elapsed % 60))s"
  else
    echo "${elapsed}s"
  fi
}
