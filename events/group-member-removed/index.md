---
id: group-member-removed
name: Group Member Removed
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Identity & Access
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `io.datarecs.identity.group.member_removed` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`GroupMembershipPayload`)

```typescript
{
  group_id: string;
  user_id: string;
  actor_id: string;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
