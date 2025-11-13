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
		const rows = db.prepare('SELECT id, name FROM note ORDER BY id ASC').all();
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
				`SELECT si.scale_id, i.id AS interval_id, i.name AS interval_name
				 FROM scale_interval si
				 JOIN intervalli i ON si.interval_id = i.id
				 ORDER BY si.scale_id ASC, i.id ASC`
			)
			.all();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch scale intervals' });
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
		endpointit: ['/api/health', '/api/notes', '/api/scales', '/api/scale-intervals'],
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


