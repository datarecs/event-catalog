---
id: core-api
name: Core API
version: 0.1.0
sends:
  - id: tenant-provisioned
  - id: domain-checked
  - id: admin-notified
  - id: user-authenticated
  - id: session-refreshed
  - id: user-logged-out
  - id: user-invited
  - id: invitation-cancelled
  - id: join-request-approved
  - id: join-request-denied
  - id: group-created
  - id: group-updated
  - id: group-deleted
  - id: group-member-added
  - id: group-member-removed
  - id: custom-role-created
  - id: custom-role-updated
  - id: custom-role-deleted
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
  - id: schedule-created
  - id: schedule-updated
  - id: schedule-deleted
  - id: api-key-created
  - id: api-key-updated
  - id: api-key-deleted
receives:
  - id: run-completed
  - id: run-failed
  - id: run-rows-processed
---

The central REST API that handles user requests, authentication, authorisation, and orchestration. Primary event producer for most domain events.

- **Event Source URI**: `/datarecs/core-api`
- **Technology**: NestJS (Node.js)
