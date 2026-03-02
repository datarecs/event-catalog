---
id: connection-deleted
name: Connection Deleted
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Connection Management
    textColor: white
    backgroundColor: green
---

Emitted when a connection is deleted. Triggers cleanup of Vault secrets and K8s egress policies.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.connection.connection.deleted` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ connection_id: string; workspace_id: string; name: string; type: ConnectionType; actor_id: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
