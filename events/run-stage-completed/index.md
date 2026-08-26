---
id: run-stage-completed
name: Run Stage Completed
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Reconciliation
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `reconciliation.run.stage.completed` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`StageCompletedPayload`)

```typescript
{
  run_id: string;
  job_id: string;
  tenant_id: string;
  stage_name: string;
  result: RunResult;
  tolerances: Array<{
        measure_name: string;
        tolerance_type: string;
        tolerance_value: number;
        within_tolerance_count: number;
        outside_tolerance_count: number;
        passed: boolean;
    }>;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
