import type { Request, Response } from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Mosque } from '../types/Mosque.js';

export function getMosques(_req: Request, res: Response): void {
  const mosques: Mosque[] = JSON.parse(
    readFileSync(join(__dirname, '../data/mosques.json'), 'utf-8')
  );
  res.json(mosques);
}
