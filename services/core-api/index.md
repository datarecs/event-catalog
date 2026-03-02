---
id: core-api
name: Core API
version: 0.1.0
sends:
  - id: tenant-provisioned
  - id: user-authenticated
  - id: user-invited
  - id: workspace-created
  - id: workspace-updated
  - id: workspace-deleted
  - id: connection-created
  - id: connection-updated
  - id: connection-deleted
  - id: connection-tested
  - id: job-created
  - id: job-updated
  - id: job-deleted
  - id: job-group-created
  - id: job-group-updated
  - id: job-group-deleted
  - id: job-triggered
  - id: job-schedule-created
  - id: api-key-created
  - id: api-key-updated
  - id: api-key-deleted
  - id: group-created
  - id: group-updated
  - id: group-deleted
  - id: custom-role-created
  - id: custom-role-updated
  - id: custom-role-deleted
receives:
  - id: job-run-completed
  - id: job-run-failed
  - id: job-run-rows-processed
---

The central REST API that handles user requests, authentication, authorisation, and orchestration. Primary event producer for most domain events.

- **Event Source URI**: `/datarecs/core-api`
- **Technology**: NestJS (Node.js)
- **Consumers**: Console (WebSocket), Reconciliation Workers, Connection Checker
