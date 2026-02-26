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
}
