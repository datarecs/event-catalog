---
id: connection-reservation-updated
name: Connection Reservation Updated
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Connection Management
    textColor: white
    backgroundColor: green
---

Emitted by connection-checker when a reserved connection's credentials are updated in Vault.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.connection.reservation.updated` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ reservation_id: string; type: ConnectionType; success: boolean; error?: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
