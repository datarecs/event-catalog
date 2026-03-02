---
id: custom-role-updated
name: Custom Role Updated
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Identity & Access
    textColor: white
    backgroundColor: green
---

Emitted when a custom RBAC role is updated.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.identity.custom_role.updated` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ role_id: number; name: string; actor_id: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
