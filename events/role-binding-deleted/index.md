---
id: role-binding-deleted
name: Role Binding Deleted
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
| **type** | `identity.role_binding.deleted` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`RoleBindingLifecyclePayload`)

```typescript
{
  role_binding_id: string;
  subject_type: string;
  subject_id: string;
  role_type: string;
  role_id: string;
  scope: string;
  workspace_id?: string;
  actor_id: string;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
