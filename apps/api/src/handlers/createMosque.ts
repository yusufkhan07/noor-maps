import type { Request, Response } from 'express';
import { MosqueRepository } from '../repositories/MosqueRepository.js';

const mosqueRepository = new MosqueRepository();

export async function createMosque(req: Request, res: Response): Promise<void> {
  const { title, address, phone, email, website, coordinate } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  if (
    !coordinate ||
    typeof coordinate.latitude !== 'number' ||
    typeof coordinate.longitude !== 'number'
  ) {
    res.status(400).json({ error: 'coordinate with latitude and longitude is required' });
    return;
  }

  try {
    const mosque = await mosqueRepository.create({
      title,
      address: typeof address === 'string' ? address : '',
      phone: typeof phone === 'string' ? phone : undefined,
      email: typeof email === 'string' ? email : undefined,
      website: typeof website === 'string' ? website : undefined,
      coordinate,
    });
    res.status(201).json(mosque);
  } catch (err) {
    console.error('createMosque error:', err);
    res.status(500).json({ error: String(err) });
  }
}
