import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { MosqueTimings } from '../types/Mosque.js';

export class MosqueTimingsRepository {
  private getAll(): MosqueTimings[] {
    return JSON.parse(
      readFileSync(join(__dirname, '../data/timings.json'), 'utf-8')
    );
  }

  findByMosqueId(mosqueId: string): MosqueTimings | undefined {
    return this.getAll().find((t) => t.mosqueId === mosqueId);
  }
}
