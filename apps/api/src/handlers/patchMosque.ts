import type { Request, Response } from 'express';
import { MosqueRepository } from '../repositories/MosqueRepository.js';

const mosqueRepository = new MosqueRepository();

const ALLOWED_FIELDS = ['address', 'phone', 'email', 'website'] as const;
type PatchableMosqueField = (typeof ALLOWED_FIELDS)[number];

export async function patchMosque(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;

  const patch: Partial<Record<PatchableMosqueField, string>> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in req.body) {
      if (typeof req.body[field] !== 'string') {
        res.status(400).json({ error: `${field} must be a string` });
        return;
      }
      patch[field] = req.body[field];
    }
  }

  if (Object.keys(patch).length === 0) {
    res.status(400).json({ error: 'At least one field must be provided' });
    return;
  }

  try {
    const mosque = await mosqueRepository.update(id, patch);
    if (!mosque) {
      res.status(404).json({ error: 'Mosque not found' });
      return;
    }
    res.json(mosque);
  } catch (err) {
    console.error('patchMosque error:', err);
    res.status(500).json({ error: String(err) });
  }
}
