# CLAUDE.md — event-catalog

> Owner subagent: `simon` · Part of the DataRecs meta-repo — see `../AGENTS.md` for the platform Priority Hierarchy (tenant isolation → calculation correctness → availability) and repo map. Do not restate that hierarchy here.

## What this is
The EventCatalog site documenting every platform event, the domains they belong to, and the services that produce/consume them (mapped to NATS subjects like `io.datarecs.<domain>.<entity>.<action>`). It is documentation/discovery only — no runtime behaviour.

## Stack & layout
[@eventcatalog/core](https://eventcatalog.dev) (Astro-based static site), Node 22.
- `domains/`, `events/`, `services/`, `commands/` — the catalog content (Markdown/MDX). Largely generated.
- `scripts/generate-from-events.mjs` — generates catalog content from the `data-models-events` package (domain/service metadata lives in this script's `DOMAIN_META` / `SERVICE_META` maps)
- `eventcatalog.config.js` — site config · `k8s/`, `Dockerfile`, `setup.sh`

## Build / test / run
- Dev server: `npm run dev`
- Generate catalog from events package: `npm run generate:events` (runs `generate-from-events.mjs`; defaults to sibling `../data-models-events`, override with `--events-path <dir>`)
- Build static site: `npm run build` · preview: `npm run preview`
- Build image + deploy to local k3d: `./setup.sh` (serves `dist/` at http://events.datarecs.local)
- No test runner configured.

## Conventions & gotchas
- Content under `domains/`, `events/`, `services/` is regenerated — edit the source-of-truth in `data-models-events` (and the metadata maps in `generate-from-events.mjs`), then re-run `generate:events`, rather than hand-editing generated MDX.
- Scripts invoke `@eventcatalog/core@latest` via npx; output goes to `dist/` (gitignored along with `.eventcatalog-core/`).

## Cross-repo
Generated from `data-models-events` (the event/NATS-subject source of truth). Describes producers/consumers including `core-api`, `connection-checker`, `reconciliation-workers`, `webhook-service`, `platform-agent`. Keep in sync when events change in `data-models-events`.
