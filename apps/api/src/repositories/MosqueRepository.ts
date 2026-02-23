import { supabase } from '../lib/supabase.js';
import type { Mosque } from '../types/Mosque.js';

type MosqueRow = {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
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
    const { data, error } = await supabase.from('mosques').select('*');
    if (error) throw error;
    return (data as MosqueRow[]).map(rowToMosque);
  }

  async findById(id: string): Promise<Mosque | undefined> {
    const { data, error } = await supabase
      .from('mosques')
      .select('*')
      .eq('id', id)
      .single();
    if (error?.code === 'PGRST116') return undefined; // row not found
    if (error) throw error;
    return rowToMosque(data as MosqueRow);
  }
}
