import { config } from 'dotenv';
import { join } from 'node:path';
// __dirname at runtime is dist/apps/api/src/ — four levels up reaches apps/api/
config({ path: join(__dirname, '../../../../.env') });

import express from 'express';
import { mosquesRouter } from './routes/mosques';

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use('/mosques', mosquesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Noor Maps API running on http://localhost:${PORT}`);
});
