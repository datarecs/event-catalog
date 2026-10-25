---
id: telemetry-consent-updated
name: Telemetry Consent Updated
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: Privacy & Consent
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | `privacy.telemetry_consent.updated` |
| **datacontenttype** | `application/json` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload

This event has no dedicated payload class. Its fail-closed audit record uses the shared `AuditEventBaseV1` envelope; optional consent details are carried in metadata.
