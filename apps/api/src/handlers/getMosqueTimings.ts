import type { Request, Response } from 'express';
import { MosqueTimingsRepository } from '../repositories/MosqueTimingsRepository.js';

const mosqueTimingsRepository = new MosqueTimingsRepository();

export async function getMosqueTimings(req: Request, res: Response): Promise<void> {
  const id = `${req.params['type']}/${req.params['osmId']}`;
  const entry = await mosqueTimingsRepository.findByMosqueId(id);

  if (!entry) {
    res.status(404).json({ error: `No timings found for mosque ${id}` });
    return;
  }

  res.json(entry);
}
