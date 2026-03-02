---
id: job-group-deleted
name: Job Group Deleted
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Reconciliation
    textColor: white
    backgroundColor: green
---

Emitted when a job group is deleted.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.reconciliation.job_group.deleted` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ job_group_id: string; workspace_id: string; name: string; job_ids: string[]; actor_id: string; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
