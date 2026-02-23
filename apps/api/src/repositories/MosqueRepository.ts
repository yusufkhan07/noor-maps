import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Mosque } from '../types/Mosque.js';

export class MosqueRepository {
  private getAll(): Mosque[] {
    return JSON.parse(
      readFileSync(join(__dirname, '../data/mosques.json'), 'utf-8')
    );
  }

  findAll(): Mosque[] {
    return this.getAll();
  }

  findById(id: string): Mosque | undefined {
    return this.getAll().find((m) => m.id === id);
  }
}
