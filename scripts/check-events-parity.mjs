#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const catalogRoot = path.resolve(scriptDirectory, '..');
const args = process.argv.slice(2);
let eventsPackagePath = path.resolve(catalogRoot, '../data-models-events');

for (let index = 0; index < args.length; index += 1) {
  if (args[index] === '--events-path' && args[index + 1]) {
    eventsPackagePath = path.resolve(args[index + 1]);
  }
}

const eventTypesPath = path.join(eventsPackagePath, 'src/envelope/event-types.ts');
if (!fs.existsSync(eventTypesPath)) {
  throw new Error(`Cannot find authoritative event types at ${eventTypesPath}`);
}

const source = fs.readFileSync(eventTypesPath, 'utf8');
const sourcePattern = /^\s+(\w+)\s+=\s+'((\w+)\.(.+))'/gm;
const expected = new Map();
let sourceMatch;

while ((sourceMatch = sourcePattern.exec(source)) !== null) {
  const [, enumKey, eventType, , entityAction] = sourceMatch;
  const slug = entityAction.replace(/[_.]/g, '-');
  if (expected.has(slug)) {
    throw new Error(`Catalog slug collision for ${slug}: ${expected.get(slug).enumKey} and ${enumKey}`);
  }
  expected.set(slug, { enumKey, eventType });
}

if (expected.size === 0) {
  throw new Error('Authoritative event enum parser found zero event types');
}

const eventsDirectory = path.join(catalogRoot, 'events');
const actualSlugs = fs.readdirSync(eventsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const errors = [];

for (const [slug, contract] of expected) {
  const eventPath = path.join(eventsDirectory, slug, 'index.md');
  if (!fs.existsSync(eventPath)) {
    errors.push(`missing ${slug} (${contract.enumKey}=${contract.eventType})`);
    continue;
  }

  const page = fs.readFileSync(eventPath, 'utf8');
  const typeMatch = page.match(/^\| \*\*type\*\* \| `([^`]+)` \|$/m);
  if (!typeMatch) {
    errors.push(`${slug} has no CloudEvents type row`);
  } else if (typeMatch[1] !== contract.eventType) {
    errors.push(`${slug} type is ${typeMatch[1]}, expected ${contract.eventType}`);
  }
}

for (const slug of actualSlugs) {
  if (!expected.has(slug)) {
    errors.push(`stale catalog event ${slug}`);
  }
}

if (errors.length > 0) {
  console.error(`Event catalog parity failed (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Event catalog parity passed: ${expected.size} authoritative event types, ${actualSlugs.length} catalog pages.`);
