---
id: connection-updated
name: Connection Updated
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Connection Management
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `io.datarecs.connection.connection.updated` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`ConnectionLifecyclePayload`)

```typescript
{
  connection_id: string;
  workspace_id: string;
  name: string;
  type: ConnectionType;
  actor_id: string;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
