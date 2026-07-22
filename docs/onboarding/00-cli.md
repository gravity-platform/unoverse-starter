---
sidebarTitle: "The CLI"
---

# The unoverse CLI

One CLI drives everything: setup, daily development, design tooling, and deployment. It ships at the root of your repository. Run `./unoverse` the first time; after `init` it installs itself to your PATH and `unoverse` works from anywhere. `unoverse help` prints this list in your terminal.

## Setup

| Command | What it does |
| --- | --- |
| `unoverse init` | Interactive setup wizard. Asks for your DOCR token, database, Redis, and auth credentials, writes `.env`, logs into the registry, and pulls all platform images. |
| `unoverse doctor` | Diagnoses environment issues across the stack: Docker, env files, containers, ports, database. Your first stop when something is off. |

## Platform

| Command | What it does |
| --- | --- |
| `unoverse start` | Starts all services. |
| `unoverse stop` | Stops all services. |
| `unoverse status` | Shows service health at a glance. |
| `unoverse check` | Runs the full health check: containers, health endpoints, built packages, loaded nodes, Canvas reachability. |
| `unoverse logs` | Opens the Dozzle log viewer. `unoverse logs <service>` streams one service's logs in the terminal. |
| `unoverse update` | Pulls the latest platform images, rebuilds packages, and restarts. |
| `unoverse open` | Opens a service in your browser: `unoverse open canvas`, `open api`, or `open logs`. |

<Warning>
`unoverse update` synchronizes your working tree with your git remote before pulling images, and discards uncommitted changes in the process. Commit your work before running it.
</Warning>

## Development

| Command | What it does |
| --- | --- |
| `unoverse dev` | The daily starter: brings the platform up if needed, installs workspace dependencies, and builds your node packages so the platform loads them. |
| `unoverse db-setup` | Runs database migrations and seeds. Tracked and idempotent; safe to re-run any time. |
| `unoverse db-verify` | Verifies the database schema matches what the platform expects. |
| `unoverse build` | Builds all node packages and restarts services. `unoverse build <package>` builds just one, for example `unoverse build @unoverse-platform/my-node`. |

## Design

| Command | What it does |
| --- | --- |
| `unoverse new` | Scaffolds an rx/ definition: `unoverse new component <name>` or `unoverse new template <org> <name>`. |
| `unoverse lint` | Lints your rx/ definitions against the schema and the platform's guard rules, the same rules Studio and the conformance checks apply. |

## Deployment

| Command | What it does |
| --- | --- |
| `unoverse deploy` | Deploys your platform to your server: platform images plus your nodes, design, and prompts. |
| `unoverse deploy design` | The fast lane for design changes: rsyncs `rx/` to the server and restarts. No build. |
| `unoverse deploy init` | First-time server provisioning. |
| `unoverse deploy db` | Runs database setup on the server. |
| `unoverse deploy caddy` | Installs the optional Caddy reverse proxy for TLS. `deploy caddy-uninstall` removes it. |
| `unoverse deploy umap` | Installs the Spatial ML service. |
| `unoverse deploy harden` | Applies security hardening to the server. |
| `unoverse deploy test` | Runs a connectivity test against the deployed platform. |

Deployment is covered step by step in [Deployment](./08-deployment.md) and the [Runbooks](../runbooks/overview.md).
