import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { IqamaFixed, MosqueTimings, ScheduleEntry } from '../types/Mosque.js';

const DATA_PATH = join(__dirname, '../data/timings.json');

export type TimingsPatch = {
  fixed?: Partial<IqamaFixed>;
  scheduleEntry?: {
    effectiveFrom: string;
    fixed: IqamaFixed;
  };
};

export class MosqueTimingsRepository {
  private read(): MosqueTimings[] {
    return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  }

  private write(data: MosqueTimings[]): void {
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  }

  findByMosqueId(mosqueId: string): MosqueTimings | undefined {
    return this.read().find((t) => t.mosqueId === mosqueId);
  }

  update(mosqueId: string, patch: TimingsPatch): MosqueTimings | undefined {
    const all = this.read();
    const index = all.findIndex((t) => t.mosqueId === mosqueId);

    if (index === -1) return undefined;

    const entry = all[index];
    const now = new Date().toISOString();

    if (patch.fixed) {
      entry.fixed = { ...entry.fixed, ...patch.fixed };
      entry.updatedAt = now;
    }

    if (patch.scheduleEntry) {
      const { effectiveFrom, fixed } = patch.scheduleEntry;
      const newEntry: ScheduleEntry = { effectiveFrom, updatedAt: now, fixed };

      // Upsert: replace existing entry with the same effectiveFrom, or append
      const existing = entry.schedule.findIndex(
        (s) => s.effectiveFrom === effectiveFrom
      );
      if (existing !== -1) {
        entry.schedule[existing] = newEntry;
      } else {
        entry.schedule.push(newEntry);
      }

      // Keep sorted ascending by effectiveFrom
      entry.schedule.sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
    }

    all[index] = entry;
    this.write(all);
    return entry;
  }
}
