---
id: webhook-service
name: Webhook Service
version: 0.1.0
sends:
  - id: delivery-failed
  - id: delivery-dead-lettered
receives:
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
  - id: reservation-created
  - id: reservation-updated
  - id: reservation-deleted
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
  - id: run-started
  - id: run-stage-completed
  - id: run-completed
  - id: run-failed
  - id: run-cancelled
  - id: run-rows-processed
  - id: api-key-created
  - id: api-key-updated
  - id: api-key-deleted
  - id: endpoint-created
  - id: endpoint-updated
  - id: endpoint-deleted
  - id: endpoint-disabled
  - id: subscription-created
  - id: subscription-updated
  - id: subscription-deleted
  - id: delivery-failed
  - id: delivery-dead-lettered
---

Knative subscriber that matches inbound CloudEvents against tenant webhook subscriptions and delivers them to registered HTTP endpoints with HMAC-SHA256 signing, retries, and dead-lettering.

- **Event Source URI**: `/datarecs/webhook-service`
- **Technology**: NestJS (Node.js)
- **Delivery**: HTTP POST with exponential-backoff retry
