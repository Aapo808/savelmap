import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';

function readSchema(sqlPath) {
	const raw = fs.readFileSync(sqlPath, 'utf-8');

	const filtered = raw
		.split(/\r?\n/)
		.filter(line => !/^\s*CREATE\s+DATABASE/i.test(line))
		.join('\n');
	return filtered;
}

function ensureSeeded(db, schemaSql) {
	const requiredTables = ['note', 'scale', 'scale_interval'];
	const placeholders = requiredTables.map(() => '?').join(',');
	const stmt = db.prepare(
		`SELECT name FROM sqlite_master WHERE type='table' AND name IN (${placeholders})`
	);
	const existing = stmt.all(...requiredTables);

	if (existing.length !== requiredTables.length) {
		db.exec('PRAGMA foreign_keys = OFF;');
		db.exec(schemaSql);
		db.exec('PRAGMA foreign_keys = ON;');
	}
}

export function getDatabase({ rootDir }) {
	const dataDir = path.join(rootDir, 'data');
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}
	const dbPath = path.join(dataDir, 'savelmap.sqlite');
	const db = new Database(dbPath);

	const schemaPath = path.join(rootDir, 'sql', 'schema.sql');
	const schemaSql = readSchema(schemaPath);
	ensureSeeded(db, schemaSql);

	return db;
}


