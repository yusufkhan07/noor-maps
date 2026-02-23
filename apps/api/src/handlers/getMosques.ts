import type { Request, Response } from 'express';
import { MosqueRepository } from '../repositories/MosqueRepository.js';

const mosqueRepository = new MosqueRepository();

export function getMosques(_req: Request, res: Response): void {
  res.json(mosqueRepository.findAll());
}
