---
id: connection-created
name: Connection Created
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Connection Management
    textColor: white
    backgroundColor: green
---

Emitted when a new database connection is created. Triggers the connection-checker to reserve and validate.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.connection.connection.created` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ connection_id: string; workspace_id: string; name: string; type: ConnectionType; actor_id: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
