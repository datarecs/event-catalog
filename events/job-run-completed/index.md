---
id: job-run-completed
name: Job Run Completed
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Reconciliation
    textColor: white
    backgroundColor: green
---

Emitted when a job run finishes successfully.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.reconciliation.run.completed` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ run_id: string; job_id: string; status: RunStatus; rows_processed: number; rows_matched: number; rows_unmatched: number; summary?: Record<string, any>; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
