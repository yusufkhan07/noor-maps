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
