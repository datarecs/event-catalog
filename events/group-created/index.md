---
id: group-created
name: Group Created
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Identity & Access
    textColor: white
    backgroundColor: green
---

Emitted when a user group is created.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.identity.group.created` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ group_id: string; name: string; description?: string; actor_id: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
