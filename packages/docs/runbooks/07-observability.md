# Runbook: Observability Stack

Install the bundled observability stack for POC/demo environments.

## Overview

The observability stack includes:
- **Grafana** (port 3000) — Dashboards and visualization
- **Prometheus** (port 9090) — Metrics collection
- **Loki** (port 3100) — Log aggregation
- **Tempo** (port 3200) — Distributed tracing
- **Promtail** — Log shipping to Loki

## When to Use

| Scenario | Install Observability? | Notes |
|----------|------------------------|-------|
| **POC / Demo** | ✅ Yes | Quick visibility into system health |
| **Enterprise** | ❌ No | Customer uses their own SIEM/observability |

## Prerequisites

- [ ] Core services deployed ([01-core.md](./01-core.md))

## Steps

### 1. Install Observability Stack

```bash
cd ansible
ansible-playbook -i inventory/production.yml playbooks/install-observability.yml
```

### 2. Access Grafana

Open `http://<VM_IP>:3000` in your browser.

Default credentials: `admin` / `admin`

## Uninstall

To remove the observability stack:

```bash
ssh root@<VM_IP> "cd /opt/gravity && docker compose stop grafana loki prometheus promtail tempo && docker compose rm -f grafana loki prometheus promtail tempo"
```

## Enterprise Alternative

For enterprise deployments, export metrics and logs to customer systems:

- **Metrics:** Configure Prometheus remote_write to customer endpoint
- **Logs:** Configure Promtail to ship to customer Splunk/ELK/Datadog
- **Traces:** Configure Tempo to export to customer Jaeger/Zipkin

See [ENTERPRISE_DEPLOYMENT.md](../../docs/architecture/ENTERPRISE_DEPLOYMENT.md) for details.
