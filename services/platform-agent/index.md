---
id: platform-agent
name: Platform Agent
version: 0.1.0
receives:
  - id: reservation-created
---

gRPC microservice for database introspection — listing databases, schemas, tables, and columns on tenant connections.

- **Event Source URI**: `/datarecs/platform-agent`
- **Technology**: NestJS gRPC (Node.js)
