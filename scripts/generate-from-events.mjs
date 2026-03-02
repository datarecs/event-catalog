#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
let eventsPackagePath = path.resolve(catalogRoot, '../data-models-events');
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--events-path' && args[i + 1]) {
    eventsPackagePath = path.resolve(args[i + 1]);
  }
}

const DOMAIN_META = {
  tenant: { catalogSlug: 'tenant-management', name: 'Tenant Management', description: 'Tenant provisioning, domain checks, and admin notifications.', badgeLabel: 'Tenant Management' },
  identity: { catalogSlug: 'identity-access', name: 'Identity & Access', description: 'Authentication, users, invitations, groups, roles, and permissions.', badgeLabel: 'Identity & Access' },
  workspace: { catalogSlug: 'workspace-management', name: 'Workspace Management', description: 'Workspace lifecycle — creation, update, and deletion.', badgeLabel: 'Workspace Management' },
  connection: { catalogSlug: 'connection-management', name: 'Connection Management', description: 'Database connection CRUD, testing, and reservation lifecycle.', badgeLabel: 'Connection Management' },
  reconciliation: { catalogSlug: 'reconciliation', name: 'Reconciliation', description: 'Jobs, job groups, triggers, schedules, runs, and result processing.', badgeLabel: 'Reconciliation' },
  platform: { catalogSlug: 'platform-operations', name: 'Platform Operations', description: 'API keys, encryption, billing, and platform administration.', badgeLabel: 'Platform Operations' },
};

const SERVICE_META = {
  'core-api': {
    name: 'Core API',
    description: 'The central REST API that handles user requests, authentication, authorisation, and orchestration. Primary event producer for most domain events.\n\n- **Event Source URI**: `/datarecs/core-api`\n- **Technology**: NestJS (Node.js)',
    sendsDomains: ['tenant', 'identity', 'workspace', 'connection', 'reconciliation', 'platform'],
    sendsExclude: ['com.datarecs.connection.reservation.', 'com.datarecs.reconciliation.run.'],
    receivesPrefix: ['com.datarecs.reconciliation.run.completed', 'com.datarecs.reconciliation.run.failed', 'com.datarecs.reconciliation.run.rows_processed'],
  },
  'connection-checker': {
    name: 'Connection Checker',
    description: 'gRPC microservice responsible for database connectivity validation, credential storage in Vault, and K8s egress policy management.\n\n- **Event Source URI**: `/datarecs/connection-checker`\n- **Technology**: NestJS gRPC (Node.js)',
    sendsPrefix: ['com.datarecs.connection.reservation.'],
    receivesPrefix: ['com.datarecs.connection.connection.created', 'com.datarecs.connection.connection.updated', 'com.datarecs.connection.connection.deleted'],
  },
  'platform-agent': {
    name: 'Platform Agent',
    description: 'gRPC microservice for database introspection — listing databases, schemas, tables, and columns on tenant connections.\n\n- **Event Source URI**: `/datarecs/platform-agent`\n- **Technology**: NestJS gRPC (Node.js)',
    sendsPrefix: [],
    receivesPrefix: ['com.datarecs.connection.reservation.created'],
  },
  'reconciliation-workers': {
    name: 'Reconciliation Workers',
    description: 'Ephemeral Node.js workers (extractors and comparators) that execute the actual data reconciliation.\n\n- **Event Source URI**: `/datarecs/reconciliation-worker`\n- **Technology**: Node.js (Turborepo)\n- **Execution**: Ephemeral K8s Jobs',
    sendsPrefix: ['com.datarecs.reconciliation.run.'],
    receivesPrefix: ['com.datarecs.reconciliation.job.triggered'],
  },
  'console': {
    name: 'Console',
    description: 'Angular SPA for logged-in users. Subscribes to events via WebSocket for real-time updates on job run status and progress.\n\n- **Technology**: Angular\n- **Event Delivery**: WebSocket (bridged from Knative by core-api)',
    sendsPrefix: [],
    receivesPrefix: ['com.datarecs.reconciliation.run.started', 'com.datarecs.reconciliation.run.stage_completed', 'com.datarecs.reconciliation.run.completed', 'com.datarecs.reconciliation.run.failed', 'com.datarecs.reconciliation.run.rows_processed'],
  },
};

const LIFECYCLE_GROUPS = {
  GROUP_CREATED: 'GroupLifecyclePayload', GROUP_UPDATED: 'GroupLifecyclePayload', GROUP_DELETED: 'GroupLifecyclePayload',
  GROUP_MEMBER_ADDED: 'GroupMembershipPayload', GROUP_MEMBER_REMOVED: 'GroupMembershipPayload',
  CUSTOM_ROLE_CREATED: 'CustomRoleLifecyclePayload', CUSTOM_ROLE_UPDATED: 'CustomRoleLifecyclePayload', CUSTOM_ROLE_DELETED: 'CustomRoleLifecyclePayload',
  USER_JOIN_REQUEST_APPROVED: 'JoinRequestDecisionPayload', USER_JOIN_REQUEST_DENIED: 'JoinRequestDecisionPayload',
  WORKSPACE_CREATED: 'WorkspaceLifecyclePayload', WORKSPACE_UPDATED: 'WorkspaceLifecyclePayload', WORKSPACE_DELETED: 'WorkspaceLifecyclePayload',
  CONNECTION_CREATED: 'ConnectionLifecyclePayload', CONNECTION_UPDATED: 'ConnectionLifecyclePayload', CONNECTION_DELETED: 'ConnectionLifecyclePayload',
  CONNECTION_RESERVED: 'ConnectionReservationPayload', CONNECTION_RESERVATION_UPDATED: 'ConnectionReservationPayload', CONNECTION_RESERVATION_DELETED: 'ConnectionReservationPayload',
  JOB_CREATED: 'JobLifecyclePayload', JOB_UPDATED: 'JobLifecyclePayload', JOB_DELETED: 'JobLifecyclePayload',
  JOB_GROUP_CREATED: 'JobGroupLifecyclePayload', JOB_GROUP_UPDATED: 'JobGroupLifecyclePayload', JOB_GROUP_DELETED: 'JobGroupLifecyclePayload',
  JOB_SCHEDULE_CREATED: 'JobScheduleLifecyclePayload', JOB_SCHEDULE_UPDATED: 'JobScheduleLifecyclePayload', JOB_SCHEDULE_DELETED: 'JobScheduleLifecyclePayload',
  API_KEY_CREATED: 'ApiKeyLifecyclePayload', API_KEY_UPDATED: 'ApiKeyLifecyclePayload', API_KEY_DELETED: 'ApiKeyLifecyclePayload',
};

function parseEventTypes(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const events = [];
  const regex = /^\s+(\w+)\s+=\s+'(com\.datarecs\.(\w+)\.(.+))'/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [, enumKey, type, domain, entityAction] = match;
    const slug = entityAction.replace(/[_.]/g, '-');
    const name = entityAction.split('.').map(p => p.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(' ');
    events.push({ enumKey, type, domain, slug, name });
  }
  return events;
}

function parsePayloadSchemas(domainDir) {
  const schemas = {};
  if (!fs.existsSync(domainDir)) return schemas;
  for (const domainName of fs.readdirSync(domainDir)) {
    const indexPath = path.join(domainDir, domainName, 'index.ts');
    if (!fs.existsSync(indexPath)) continue;
    const content = fs.readFileSync(indexPath, 'utf-8');
    const classRegex = /export class (\w+Payload)\s*\{([\s\S]*?)^\}/gm;
    let classMatch;
    while ((classMatch = classRegex.exec(content)) !== null) {
      const [, className, body] = classMatch;
      const fields = [];
      const fieldRegex = /@Expose\(\)[\s\S]*?(\w+)([!?]):\s*([^;]+);/g;
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(body)) !== null) {
        const [, fieldName, optMarker, fieldType] = fieldMatch;
        fields.push({ fieldName, fieldType: fieldType.trim(), optional: optMarker === '?' });
      }
      schemas[className] = fields;
    }
  }
  return schemas;
}

function getPayloadClassName(enumKey) {
  if (LIFECYCLE_GROUPS[enumKey]) return LIFECYCLE_GROUPS[enumKey];
  const parts = enumKey.toLowerCase().split('_');
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('') + 'Payload';
}

function formatSchema(fields) {
  if (!fields || fields.length === 0) return '{ /* schema not found — check data-models-events */ }';
  return '{\n' + fields.map(f => `  ${f.fieldName}${f.optional ? '?' : ''}: ${f.fieldType};`).join('\n') + '\n}';
}

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function generateDomains(events) {
  const domains = new Set(events.map(e => e.domain));
  for (const domain of domains) {
    const meta = DOMAIN_META[domain];
    if (!meta) { console.warn(`  Warning: Unknown domain: ${domain}`); continue; }
    const dir = path.join(catalogRoot, 'domains', meta.catalogSlug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.md'),
`---
id: ${meta.catalogSlug}
name: ${meta.name}
version: 0.1.0
---

${meta.description}

<Admonition type="info">
All events in this domain follow the CloudEvents v1.0 spec with Knative-compatible type naming: \`com.datarecs.<domain>.<entity>.<action>\`
</Admonition>
`);
  }
  return domains;
}

function generateEvents(events, allSchemas) {
  for (const event of events) {
    const meta = DOMAIN_META[event.domain];
    const badgeLabel = meta ? meta.badgeLabel : event.domain;
    const payloadClass = getPayloadClassName(event.enumKey);
    const schema = formatSchema(allSchemas[payloadClass]);
    const dir = path.join(catalogRoot, 'events', event.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.md'),
`---
id: ${event.slug}
name: ${event.name}
version: 0.1.0
badges:
  - content: CloudEvents v1.0
    textColor: white
    backgroundColor: blue
  - content: ${badgeLabel}
    textColor: white
    backgroundColor: green
---

## CloudEvents Attributes

| Attribute | Value |
|---|---|
| **type** | \`${event.type}\` |
| **datacontenttype** | \`application/json\` |
| **Custom: tenantid** | Tenant UUID for multi-tenant routing |

## Payload Schema (\`${payloadClass}\`)

\`\`\`typescript
${schema}
\`\`\`

<Admonition type="tip">
Schema defined in \`@datarecs/data-models-events\` — import and validate with class-validator.
</Admonition>
`);
  }
}

function generateServices(events) {
  for (const [serviceSlug, meta] of Object.entries(SERVICE_META)) {
    const sends = [];
    const receives = [];
    for (const event of events) {
      if (meta.sendsPrefix && meta.sendsPrefix.some(p => event.type.startsWith(p))) sends.push(event.slug);
      if (meta.sendsDomains) {
        const inDomain = meta.sendsDomains.includes(event.domain);
        const excluded = (meta.sendsExclude || []).some(p => event.type.startsWith(p));
        if (inDomain && !excluded && !sends.includes(event.slug)) sends.push(event.slug);
      }
      if (meta.receivesPrefix && meta.receivesPrefix.some(p => event.type === p || event.type.startsWith(p))) receives.push(event.slug);
    }
    const dir = path.join(catalogRoot, 'services', serviceSlug);
    ensureDir(dir);
    let fm = `---\nid: ${serviceSlug}\nname: ${meta.name}\nversion: 0.1.0`;
    if (sends.length > 0) { fm += '\nsends:'; for (const s of sends) fm += `\n  - id: ${s}`; }
    if (receives.length > 0) { fm += '\nreceives:'; for (const r of receives) fm += `\n  - id: ${r}`; }
    fm += '\n---';
    fs.writeFileSync(path.join(dir, 'index.md'), `${fm}\n\n${meta.description}\n`);
  }
}

// --- Main ---
const eventTypesPath = path.join(eventsPackagePath, 'src/envelope/event-types.ts');
const domainsPath = path.join(eventsPackagePath, 'src/domains');

if (!fs.existsSync(eventTypesPath)) {
  console.error(`Cannot find event-types.ts at: ${eventTypesPath}`);
  console.error(`Use --events-path to specify the data-models-events location`);
  process.exit(1);
}

console.log(`Reading events from: ${eventsPackagePath}`);
const events = parseEventTypes(eventTypesPath);
console.log(`  Found ${events.length} event types`);
const allSchemas = parsePayloadSchemas(domainsPath);
console.log(`  Found ${Object.keys(allSchemas).length} payload schemas`);

console.log(`\nGenerating catalog...`);
const domains = generateDomains(events);
console.log(`  ${domains.size} domains`);
generateEvents(events, allSchemas);
console.log(`  ${events.length} events`);
generateServices(events);
console.log(`  ${Object.keys(SERVICE_META).length} services`);
console.log(`\nDone! Event catalog generated at: ${catalogRoot}`);
