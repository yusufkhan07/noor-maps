import type { Request, Response } from 'express';
import { MosqueTimingsRepository } from '../repositories/MosqueTimingsRepository.js';

const mosqueTimingsRepository = new MosqueTimingsRepository();

export function getMosqueTimings(req: Request, res: Response): void {
  const id = req.params['id'] as string;
  const entry = mosqueTimingsRepository.findByMosqueId(id);

  if (!entry) {
    res.status(404).json({ error: `No timings found for mosque ${id}` });
    return;
  }

  res.json(entry);
}
