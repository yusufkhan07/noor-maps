import type { Request, Response } from 'express';
import { MosqueRepository } from '../repositories/MosqueRepository.js';

const mosqueRepository = new MosqueRepository();

export async function getMosques(_req: Request, res: Response): Promise<void> {
  try {
    const mosques = await mosqueRepository.findAll();
    res.json(mosques);
  } catch (err) {
    console.error('getMosques error:', err);
    res.status(500).json({ error: String(err) });
  }
}
