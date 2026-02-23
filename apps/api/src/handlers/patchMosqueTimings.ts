import type { Request, Response } from 'express';
import { MosqueTimingsRepository, type TimingsPatch } from '../repositories/MosqueTimingsRepository.js';

const mosqueTimingsRepository = new MosqueTimingsRepository();

export function patchMosqueTimings(req: Request, res: Response): void {
  const id = req.params['id'] as string;
  const { fixed, scheduleEntry } = req.body as TimingsPatch;

  if (!fixed && !scheduleEntry) {
    res.status(400).json({ error: 'Request body must include fixed and/or scheduleEntry' });
    return;
  }

  const updated = mosqueTimingsRepository.update(id, { fixed, scheduleEntry });

  if (!updated) {
    res.status(404).json({ error: `No timings found for mosque ${id}` });
    return;
  }

  res.json(updated);
}
