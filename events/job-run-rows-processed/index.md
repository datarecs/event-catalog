---
id: job-run-rows-processed
name: Job Run Rows Processed
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Reconciliation
    textColor: white
    backgroundColor: green
---

Progress event emitted periodically during extraction/comparison to report row processing counts.

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `com.datarecs.reconciliation.run.rows_processed` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema

```typescript
{ run_id: string; job_id: string; stage_name: string; row_count: number; mismatch_count?: number; }
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
