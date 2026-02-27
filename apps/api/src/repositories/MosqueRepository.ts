import { supabase } from '../lib/supabase.js';
import type { Mosque } from '../types/Mosque.js';

type MosqueRow = {
  id: string;
  title: string;
  address: string;
  longitude: number; // ST_X(location)
  latitude: number;  // ST_Y(location)
  phone: string | null;
  email: string | null;
  website: string | null;
  method: number | null;
  school: number | null;
};

export type CreateMosqueInput = {
  title: string;
  address: string;
  coordinate: { latitude: number; longitude: number };
  phone?: string;
  email?: string;
  website?: string;
  method?: number;
  school?: 0 | 1;
};

function rowToMosque(row: MosqueRow): Mosque {
  return {
    id: row.id,
    title: row.title,
    address: row.address,
    coordinate: { latitude: row.latitude, longitude: row.longitude },
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    method: row.method ?? undefined,
    school: (row.school as 0 | 1 | null) ?? undefined,
  };
}

export class MosqueRepository {
  async findAll(): Promise<Mosque[]> {
    const { data, error } = await supabase.rpc('mosques_all');
    if (error) throw error;
    return (data as MosqueRow[]).map(rowToMosque);
  }

  async findById(id: string): Promise<Mosque | undefined> {
    const { data, error } = await supabase.rpc('mosque_by_id', { p_id: id });
    if (error) throw error;
    const rows = data as MosqueRow[];
    if (rows.length === 0) return undefined;
    return rowToMosque(rows[0]);
  }

  async findWithinRadius(lat: number, lng: number, radiusMeters: number): Promise<Mosque[]> {
    const { data, error } = await supabase.rpc('mosques_within_radius', {
      lat,
      lng,
      radius_meters: radiusMeters,
    });
    if (error) throw error;
    return (data as MosqueRow[]).map(rowToMosque);
  }

  async update(id: string, patch: { address?: string; phone?: string; email?: string; website?: string }): Promise<Mosque | undefined> {
    const { error } = await supabase
      .from('mosques')
      .update(patch)
      .eq('id', id);
    if (error) throw error;
    return this.findById(id);
  }

  async create(input: CreateMosqueInput): Promise<Mosque> {
    const { coordinate, ...rest } = input;
    const { data, error } = await supabase
      .from('mosques')
      .insert({
        id: crypto.randomUUID(),
        title: rest.title,
        address: rest.address,
        location: `POINT(${coordinate.longitude} ${coordinate.latitude})`,
        phone: rest.phone ?? null,
        email: rest.email ?? null,
        website: rest.website ?? null,
        method: rest.method ?? null,
        school: rest.school ?? null,
      })
      .select('id, title, address, phone, email, website, method, school')
      .single();
    if (error) throw error;
    const row = data as Omit<MosqueRow, 'latitude' | 'longitude'>;
    return rowToMosque({ ...row, latitude: coordinate.latitude, longitude: coordinate.longitude, method: row.method ?? null, school: row.school ?? null });
  }
}
