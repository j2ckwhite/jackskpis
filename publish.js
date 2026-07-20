#!/usr/bin/env node
/**
 * Bakes a Pulse "Backup" JSON export into the public, read-only copy of the dashboard.
 *
 * Usage:
 *   node publish.js path/to/pulse-kpi-backup-2026-07-19.json
 *
 * What it does:
 *   1. Reads the master dashboard template from output/dashboards/rolemade-kpi/index.html
 *   2. Embeds the given backup JSON as EMBEDDED_SNAPSHOT (+ a date pulled from the filename)
 *   3. Writes the result to projects/jackskpis/index.html
 *
 * It does NOT touch your master template, and it does NOT commit/push —
 * review the file, then commit and push it yourself (or ask Claude to).
 */
const fs = require("fs");
const path = require("path");

const backupPath = process.argv[2];
if (!backupPath) {
  console.error("Usage: node publish.js path/to/pulse-kpi-backup-YYYY-MM-DD.json");
  process.exit(1);
}

const templatePath = path.join(__dirname, "..", "..", "output", "dashboards", "rolemade-kpi", "index.html");
const outPath = path.join(__dirname, "index.html");

const template = fs.readFileSync(templatePath, "utf8");
const backupRaw = fs.readFileSync(backupPath, "utf8");
const backup = JSON.parse(backupRaw); // throws if malformed — good, we want that to fail loudly

if (backup.v !== 1 || !Array.isArray(backup.retainers)) {
  console.error("That doesn't look like a valid Pulse backup file (missing v:1 / retainers array).");
  process.exit(1);
}

const nameMatch = path.basename(backupPath).match(/(\d{4}-\d{2}-\d{2})/);
const snapshotDate = nameMatch ? nameMatch[1] : new Date().toISOString().slice(0, 10);

let out = template;
out = out.replace(
  "const EMBEDDED_SNAPSHOT = null;",
  `const EMBEDDED_SNAPSHOT = ${JSON.stringify(backup)};`
);
out = out.replace(
  'const EMBEDDED_SNAPSHOT_DATE = null; // e.g. "2026-07-19"',
  `const EMBEDDED_SNAPSHOT_DATE = "${snapshotDate}";`
);

if (out === template) {
  console.error("Could not find the EMBEDDED_SNAPSHOT placeholders in the template — has the dashboard file changed shape?");
  process.exit(1);
}

fs.writeFileSync(outPath, out, "utf8");
console.log(`Published snapshot dated ${snapshotDate} -> ${outPath}`);
console.log("Next: review it locally, then `git add index.html && git commit -m \"update: " + snapshotDate + "\" && git push`");
