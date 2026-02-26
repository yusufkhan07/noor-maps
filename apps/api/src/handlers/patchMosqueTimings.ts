import type { Request, Response } from 'express';
import { MosqueTimingsRepository, type TimingsPatch } from '../repositories/MosqueTimingsRepository.js';

const mosqueTimingsRepository = new MosqueTimingsRepository();

export async function patchMosqueTimings(req: Request, res: Response): Promise<void> {
  const id = `${req.params['type']}/${req.params['osmId']}`;
  const body = req.body as TimingsPatch;
  const { fixed, scheduleEntry } = body;

  console.log(`[patchMosqueTimings] PATCH /mosques/${id}/timings — body:`, JSON.stringify(body));

  if (!fixed && !scheduleEntry) {
    console.warn('[patchMosqueTimings] 400: body must include fixed and/or scheduleEntry');
    res.status(400).json({ error: 'Request body must include fixed and/or scheduleEntry' });
    return;
  }

  try {
    console.log(`[patchMosqueTimings] calling repository.update for mosque ${id}`);
    const updated = await mosqueTimingsRepository.update(id, { fixed, scheduleEntry });

    if (!updated) {
      console.warn(`[patchMosqueTimings] 404: no timings row for mosque ${id}`);
      res.status(404).json({ error: `No timings found for mosque ${id}` });
      return;
    }

    console.log(`[patchMosqueTimings] success for mosque ${id}:`, JSON.stringify(updated));
    res.json(updated);
  } catch (err) {
    console.error('[patchMosqueTimings] 500 error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
