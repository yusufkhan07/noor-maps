import { config } from 'dotenv';
import { join } from 'node:path';
// __dirname at runtime is dist/apps/api/src/ — four levels up reaches apps/api/
config({ path: join(__dirname, '../../../../.env') });

import express from 'express';
import { mosquesRouter } from './routes/mosques';

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

const app = express();

app.use(express.json());
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/mosques', mosquesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Noor Maps API running on http://localhost:${PORT}`);
});
