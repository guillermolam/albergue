import { readFile, readdir } from 'node:fs/promises';

const migrationDir = new URL('../migrations/', import.meta.url);
const journal = JSON.parse(
  await readFile(new URL('meta/_journal.json', migrationDir), 'utf8'),
);
const files = (await readdir(migrationDir)).filter((file) => file.endsWith('.sql'));
const canonical = journal.entries.map(({ tag }) => `${tag}.sql`);
const missing = canonical.filter((file) => !files.includes(file));
const unjournaledGenerated = files.filter(
  (file) => /^000\d_/.test(file) && !canonical.includes(file),
);

if (journal.dialect !== 'postgresql' || missing.length || unjournaledGenerated.length) {
  console.error(
    JSON.stringify(
      { dialect: journal.dialect, missing, unjournaledGenerated },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(`Canonical PostgreSQL chain: ${canonical.join(', ')}`);
console.log('Legacy 001-005 SQL files are excluded by ADR-0001.');
