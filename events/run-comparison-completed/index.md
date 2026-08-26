---
id: run-comparison-completed
name: Run Comparison Completed
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
| **type** | `reconciliation.run.comparison.completed` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (`ComparisonCompletedPayload`)

```typescript
{
  run_id: string;
  job_id: string;
  tenant_id: string;
  source_row_counts: Record<string, number>;
  join_stats: {
        matched_groups: number;
        unmatched_by_source: Record<string, number>;  // e.g. { "source_0": 5, "source_1": 20 } — scales to N sources
    };
  tolerances: Array<{
        measure_name: string;
        tolerance_type: string;
        tolerance_value: number;
        within_tolerance_count: number;
        outside_tolerance_count: number;
        passed: boolean;
    }>;
  result: RunResult;
  rows_compared: number;
  rows_matched: number;
  rows_unmatched: number;
}
```

<Admonition type="tip">
Schema defined in `@datarecs/data-models-events` — import and validate with class-validator.
</Admonition>
