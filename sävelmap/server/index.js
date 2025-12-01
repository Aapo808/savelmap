import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getDatabase } from './lib/db.js';

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = getDatabase({
	rootDir: path.resolve(__dirname, '..'),
});

app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' });
});

app.get('/api/notes', (_req, res) => {
	try {
		const rows = db
			.prepare(
				`SELECT id,
						name,
						flat_name,
						CASE
							WHEN flat_name IS NOT NULL THEN name || '/' || flat_name
							ELSE name
						END AS display_name
				 FROM note
				 ORDER BY id ASC`
			)
			.all();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch notes' });
	}
});

app.get('/api/scales', (_req, res) => {
	try {
		const rows = db.prepare('SELECT id, display_name FROM scale ORDER BY display_name ASC').all();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch scales' });
	}
});

app.get('/api/scale-intervals', (_req, res) => {
	try {
		const rows = db
			.prepare(
				`SELECT si.scale_id, si.interval_id
				 FROM scale_interval si
				 ORDER BY si.scale_id ASC, si.interval_id ASC`
			)
			.all();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch scale intervals' });
	}
});

// Return scales together with the concrete note names for a given root.
// Example: GET /api/scale-notes?root=5
app.get('/api/scale-notes', (_req, res) => {
	try {
		const root = Number(_req.query.root) || 0;

		// load notes map (id -> display_name)
		const notesRows = db
			.prepare(
				`SELECT id, name, flat_name, CASE WHEN flat_name IS NOT NULL THEN name || '/' || flat_name ELSE name END AS display_name FROM note`
			)
			.all();
		const notesMap = new Map(notesRows.map(r => [r.id, r.display_name]));

		// load scales + intervals
		const rows = db
			.prepare(
				`SELECT 
					s.id,
					s.display_name,
					GROUP_CONCAT(si.interval_id) AS intervals
				FROM scale s
				LEFT JOIN scale_interval si ON s.id = si.scale_id
				GROUP BY s.id
				ORDER BY s.display_name ASC`
			)
			.all();

		const formatted = rows.map(row => {
			const intervals = row.intervals ? row.intervals.split(',').map(Number) : [];
			const note_ids = intervals.map(semi => (root + semi) % 12);
			const note_names = note_ids.map(id => notesMap.get(id) || null);
			return {
				id: row.id,
				display_name: row.display_name,
				intervals,
				note_ids,
				note_names,
			};
		});

		res.json(formatted);
	} catch (err) {
		console.error('scale-notes error', err);
		res.status(500).json({ error: 'Failed to fetch scale notes' });
	}
});

app.get('/', (_req, res, next) => {
	const clientDist = path.resolve(__dirname, '../dist');
	if (fs.existsSync(clientDist)) {
		return res.sendFile(path.join(clientDist, 'index.html'));
	}
	return res.json({
		palvelu: 'savelmap api',
		viesti: 'Frontti pyörii @ "http://localhost:5173".',
		endpointit: ['/api/health', '/api/notes', '/api/scales', '/api/scale-notes'],
	});
});

const clientDist = path.resolve(__dirname, '../dist');
if (fs.existsSync(clientDist)) {
	app.use(express.static(clientDist));
	app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Serveri pyörii @ http://localhost:${PORT}`);
});


