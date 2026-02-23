import type { Request, Response } from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { MosqueTimings } from '../types/Mosque.js';

export function getMosqueTimings(req: Request, res: Response): void {
  const { id } = req.params;
  const timings: MosqueTimings[] = JSON.parse(
    readFileSync(join(__dirname, '../data/timings.json'), 'utf-8')
  );
  const entry = timings.find((t) => t.mosqueId === id);

  if (!entry) {
    res.status(404).json({ error: `No timings found for mosque ${id}` });
    return;
  }

  res.json(entry);
}
