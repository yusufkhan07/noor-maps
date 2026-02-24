import { supabase } from '../lib/supabase.js';
import type { IqamaFixed, MosqueTimings, ScheduleEntry } from '../types/Mosque.js';

type MosqueTimingsRow = {
  mosque_id: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  updated_at: string;
  schedule: ScheduleEntry[];
};

function rowToMosqueTimings(row: MosqueTimingsRow): MosqueTimings {
  return {
    mosqueId: row.mosque_id,
    fixed: {
      fajr: row.fajr,
      dhuhr: row.dhuhr,
      asr: row.asr,
      maghrib: row.maghrib,
      isha: row.isha,
    },
    updatedAt: row.updated_at,
    schedule: row.schedule,
  };
}

function buildFixedPayload(fixed: Partial<IqamaFixed>, now: string): Partial<MosqueTimingsRow> {
  const payload: Partial<MosqueTimingsRow> = { updated_at: now };
  if (fixed.fajr !== undefined) payload.fajr = fixed.fajr;
  if (fixed.dhuhr !== undefined) payload.dhuhr = fixed.dhuhr;
  if (fixed.asr !== undefined) payload.asr = fixed.asr;
  if (fixed.maghrib !== undefined) payload.maghrib = fixed.maghrib;
  if (fixed.isha !== undefined) payload.isha = fixed.isha;
  return payload;
}

function upsertScheduleEntry(schedule: ScheduleEntry[], newEntry: ScheduleEntry): ScheduleEntry[] {
  const existingIndex = schedule.findIndex((s) => s.effectiveFrom === newEntry.effectiveFrom);
  const updated = existingIndex === -1
    ? [...schedule, newEntry]
    : schedule.map((s, i) => (i === existingIndex ? newEntry : s));
  return updated.sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
}

export type TimingsPatch = {
  fixed?: Partial<IqamaFixed>;
  scheduleEntry?: {
    effectiveFrom: string;
    fixed: IqamaFixed;
  };
};

export class MosqueTimingsRepository {
  async findByMosqueId(mosqueId: string): Promise<MosqueTimings | undefined> {
    const { data, error } = await supabase
      .from('mosque_timings')
      .select('*')
      .eq('mosque_id', mosqueId)
      .single();
    if (error?.code === 'PGRST116') return undefined; // row not found
    if (error) throw error;
    return rowToMosqueTimings(data as MosqueTimingsRow);
  }

  async update(mosqueId: string, patch: TimingsPatch): Promise<MosqueTimings | undefined> {
    const now = new Date().toISOString();

    // Check if a row already exists
    const { data: existing, error: fetchError } = await supabase
      .from('mosque_timings')
      .select('*')
      .eq('mosque_id', mosqueId)
      .single();
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    const rowExists = fetchError?.code !== 'PGRST116' && existing != null;

    let payload: Partial<MosqueTimingsRow> & { mosque_id: string };

    if (rowExists) {
      // UPDATE: only set the fields that were provided
      payload = {
        mosque_id: mosqueId,
        ...(patch.fixed ? buildFixedPayload(patch.fixed, now) : {}),
      };
    } else {
      // INSERT: fill missing prayer time fields with empty string to satisfy NOT NULL
      const fixedWithDefaults: IqamaFixed = {
        fajr: patch.fixed?.fajr ?? '',
        dhuhr: patch.fixed?.dhuhr ?? '',
        asr: patch.fixed?.asr ?? '',
        maghrib: patch.fixed?.maghrib ?? '',
        isha: patch.fixed?.isha ?? '',
      };
      payload = {
        mosque_id: mosqueId,
        ...buildFixedPayload(fixedWithDefaults, now),
        schedule: [],
      };
    }

    if (patch.scheduleEntry) {
      const existingSchedule = rowExists
        ? ((existing as MosqueTimingsRow).schedule ?? [])
        : [];
      const { effectiveFrom, fixed } = patch.scheduleEntry;
      const newEntry: ScheduleEntry = { effectiveFrom, updatedAt: now, fixed };
      payload.schedule = upsertScheduleEntry(existingSchedule, newEntry);
    }

    const { data, error } = await supabase
      .from('mosque_timings')
      .upsert(payload, { onConflict: 'mosque_id' })
      .select()
      .single();
    if (error) throw error;
    return rowToMosqueTimings(data as MosqueTimingsRow);
  }
}
