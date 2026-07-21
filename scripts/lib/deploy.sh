#!/usr/bin/env bash
# unoverse deploy — deploy to production VM from local

cmd_deploy() {
  # ── deploy runtime <workflow-id> — push a canvas to the kit's runtime ──
  # No VM, no ansible, no .env.production: the PLATFORM compiles the workflow and
  # pushes the artifact to the runtime (same path as the Canvas Deploy button).
  #   PLATFORM_URL (default http://localhost:4105)  UNOVERSE_TOKEN (bearer; empty in dev)
  # The runtime target is the platform's RUNTIME_URL (default http://localhost:4107).
  if [ "${1:-}" = "runtime" ]; then
    local wf_id="${2:-}"
    if [ -z "$wf_id" ]; then
      fail "Usage: unoverse deploy runtime <workflow-id>"
      info "The workflow id is in the Canvas URL: /workflow/<id>"
      exit 1
    fi
    local platform="${PLATFORM_URL:-http://localhost:4105}"
    local auth_args=()
    [ -n "${UNOVERSE_TOKEN:-}" ] && auth_args=(-H "Authorization: Bearer $UNOVERSE_TOKEN")

    banner "Deploying workflow $wf_id to the runtime"
    echo ""
    local resp http_code body
    resp=$(curl -s -w "\n%{http_code}" -X POST "${auth_args[@]}" \
      -H "Content-Type: application/json" \
      "$platform/api/workflows/$wf_id/deploy" 2>&1) || {
      fail "Platform unreachable at $platform — is the dev stack running?"
      exit 1
    }
    http_code=$(echo "$resp" | tail -1)
    body=$(echo "$resp" | sed '$d')

    if [ "$http_code" = "200" ]; then
      ok "Deployed"
      echo "$body" | python3 -c '
import json,sys
d = json.load(sys.stdin)
rt = d.get("runtime", {})
print("  workflow:  %s (%s)" % (rt.get("name") or "?", rt.get("workflowId") or "?"))
print("  nodes:     %s" % rt.get("nodeCount", "?"))
print("  runtime:   %s  (open for status/runs)" % d.get("runtimeUrl", "?"))
' 2>/dev/null || echo "  $body"
    else
      fail "Deploy failed (HTTP $http_code)"
      echo "  $body"
      case "$http_code" in
        401|403) info "Set UNOVERSE_TOKEN=<jwt> when the platform's auth is on" ;;
        404)     info "No workflow with that id — check the Canvas URL: /workflow/<id>" ;;
        502)     info "The runtime isn't reachable from the platform — start it (RUNTIME_URL, default :4107)" ;;
      esac
      exit 1
    fi
    echo ""
    return 0
  fi

  local env_prod="$ROOT/.env.production"

  if [ ! -f "$env_prod" ]; then
    fail ".env.production not found"
    echo ""
    info "Create it from the template:"
    info "  cp .env.production.example .env.production"
    info "  # Fill in DEPLOY_HOST, DEPLOY_USER, and production values"
    echo ""
    exit 1
  fi

  # Read deploy target from .env.production
  local deploy_host deploy_user
  deploy_host=$(grep '^DEPLOY_HOST=' "$env_prod" | cut -d= -f2- | tr -d '\r\n' | xargs)
  deploy_user=$(grep '^DEPLOY_USER=' "$env_prod" | cut -d= -f2- | tr -d '\r\n' | xargs)

  if [ -z "$deploy_host" ] || [ "$deploy_host" = "your-vm-ip" ]; then
    fail "DEPLOY_HOST is not set in .env.production"
    exit 1
  fi
  deploy_user="${deploy_user:-root}"

  banner "Deploying to $deploy_host"
  echo ""
  timer_start

  # Check ansible is installed
  if ! command -v ansible-playbook &>/dev/null; then
    fail "Ansible is not installed"
    info "Install: pip install ansible"
    exit 1
  fi
  ok "Ansible available"

  # Generate a temporary inventory from .env.production
  local tmp_inventory
  tmp_inventory=$(mktemp).yml
  cat > "$tmp_inventory" << 'EOF'
all:
  hosts:
    gravity-prod:
      ansible_host: DEPLOY_HOST_PLACEHOLDER
      ansible_user: DEPLOY_USER_PLACEHOLDER
      ansible_python_interpreter: /usr/bin/python3
EOF

  # Replace placeholders with actual values
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/DEPLOY_HOST_PLACEHOLDER/$deploy_host/g" "$tmp_inventory"
    sed -i '' "s/DEPLOY_USER_PLACEHOLDER/$deploy_user/g" "$tmp_inventory"
  else
    sed -i "s/DEPLOY_HOST_PLACEHOLDER/$deploy_host/g" "$tmp_inventory"
    sed -i "s/DEPLOY_USER_PLACEHOLDER/$deploy_user/g" "$tmp_inventory"
  fi

  # Debug: show what's in the inventory
  echo ""
  info "Generated inventory file:"
  cat "$tmp_inventory" | sed 's/^/  /'
  echo ""

  local ansible_dir="$ROOT/ansible"
  # ansible only reads ansible.cfg from CWD/env — we run from the repo root, so
  # point it at ours explicitly (inventory defaults, deprecation-noise silencing).
  export ANSIBLE_CONFIG="$ansible_dir/ansible.cfg"
  local subcommand="${1:-}"

  case "$subcommand" in
    ""|deploy)
      # THE deploy (starter developers): YOUR server gets the latest platform
      # images AND your local work (your custom nodes built locally with dists
      # shipped, your rx design, your prompts).
      info "Deploying your platform (images + your local work)..."
      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/deploy-images.yml" \
        -e "env_file=$env_prod"

      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/deploy-packages.yml" \
        -e "env_file=$env_prod"
      ;;
    design|rx)
      # Design fast lane: rsync rx/ only + restart. No build — definitions
      # synthesize into component nodes at boot; restyles apply live.
      info "Deploying design (rx/ definitions)..."
      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/deploy-design.yml"
      ;;
    init|full)
      # FIRST-TIME provisioning only (base host + services + carve-out).
      # Marketplace nodes need no step: boot converges them from the shared
      # installed_plugins state (keep-latest). Day-to-day = `deploy a` / `deploy b`.
      info "First-time provisioning (install + carve-out)..."
      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/install.yml" \
        -e "env_file=$env_prod"

      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/deploy-packages.yml" \
        -e "env_file=$env_prod"
      ;;
    db)
      info "Running database setup..."
      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/db-setup.yml" \
        -e "env_file=$env_prod"
      ;;
    caddy)
      local domain
      domain=$(grep '^DOMAIN=' "$env_prod" | cut -d= -f2-)
      if [ -z "$domain" ] || [ "$domain" = "yourdomain.com" ]; then
        fail "DOMAIN is not set in .env.production"
        exit 1
      fi
      # Optional flags from .env.production (both default off):
      #   CADDY_INCLUDE_UMAP=true → expose umap.<domain> (POC only)
      #   CADDY_BEHIND_LB=true    → plain :80, the customer LB terminates TLS
      local include_umap behind_lb
      include_umap=$(grep '^CADDY_INCLUDE_UMAP=' "$env_prod" | cut -d= -f2- | tr -d '\r\n' | xargs)
      behind_lb=$(grep '^CADDY_BEHIND_LB=' "$env_prod" | cut -d= -f2- | tr -d '\r\n' | xargs)
      info "Installing Caddy for $domain..."
      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/install-caddy.yml" \
        -e "domain=$domain" \
        -e "include_umap=${include_umap:-false}" \
        -e "behind_lb=${behind_lb:-false}" \
        -e "env_file=$env_prod"
      ;;
    caddy-uninstall|uninstall-caddy)
      info "Uninstalling Caddy (reverts to direct host ports)..."
      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/uninstall-caddy.yml"
      ;;
    umap)
      info "Installing UMAP service..."
      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/install-umap.yml" \
        -e "env_file=$env_prod"
      ;;
    test|check)
      info "Running connectivity test..."
      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/test-connectivity.yml" \
        -e "env_file=$env_prod"
      ;;
    harden)
      info "Hardening VM (SSH, firewall, updates)..."
      echo ""
      ansible-playbook \
        -i "$tmp_inventory" \
        "$ansible_dir/playbooks/harden.yml"
      ;;
    *)
      echo "Usage: unoverse deploy [command]"
      echo ""
      echo "  (none)       Deploy your platform: pull images + ship your work"
      echo "               (your nodes built locally, rx, prompts) + restart."
      echo ""
      echo "Runtime:"
      echo "  runtime <workflow-id>   Compile + push a canvas to the kit's runtime (:4107)"
      echo ""
      echo "Fast lane:"
      echo "  design       rx/ definitions only: rsync + restart (no build)"
      echo ""
      echo "Setup & utilities:"
      echo "  init         First-time provisioning (install + carve-out)"
      echo "  db           Run database setup"
      echo "  caddy        Install Caddy TLS reverse proxy"
      echo "  caddy-uninstall  Remove Caddy"
      echo "  umap         Install UMAP AI service"
      echo "  harden       Security hardening (SSH, firewall, updates)"
      echo "  test         Run connectivity test"
      rm -f "$tmp_inventory"
      exit 1
      ;;
  esac

  rm -f "$tmp_inventory"

  echo ""
  echo -e "  ${GREEN}${BOLD}Done${NC} ${DIM}in $(timer_elapsed)${NC}"
  echo ""
}
