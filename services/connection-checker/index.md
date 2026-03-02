---
id: connection-checker
name: Connection Checker
version: 0.1.0
sends:
  - id: connection-reserved
  - id: connection-reservation-updated
  - id: connection-reservation-deleted
receives:
  - id: connection-created
  - id: connection-updated
  - id: connection-deleted
---

gRPC microservice responsible for database connectivity validation, credential storage in Vault, and K8s egress policy management.

- **Event Source URI**: `/datarecs/connection-checker`
- **Technology**: NestJS gRPC (Node.js)
- **Protocol**: gRPC (via `data-models-protos`)
