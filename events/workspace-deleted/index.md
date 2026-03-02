---
id: workspace-deleted
name: Workspace Deleted
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Workspace Management
    textColor: white
    backgroundColor: green
---

Emitted when a workspace is deleted.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.workspace.workspace.deleted` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ workspace_id: string; name: string; actor_id: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
