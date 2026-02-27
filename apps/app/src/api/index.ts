import Constants from 'expo-constants';
import type { Mosque } from '../screens/MapsScreen/MosqueBottomSheet/types';

const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
export const API_BASE = `http://${devHost}:3000`;

export type AladhanTimings = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export type MosqueTimings = {
  fixed: Record<string, string>;
};

export async function fetchMosques(): Promise<Mosque[]> {
  const res = await fetch(`${API_BASE}/mosques`);
  if (!res.ok) throw new Error(`Failed to fetch mosques: ${res.status}`);
  return res.json();
}

export async function fetchAladhanTimings(lat: number, lng: number): Promise<AladhanTimings> {
  const timestamp = Math.floor(Date.now() / 1000);
  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=2`
  );
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);
  const json = await res.json();
  const { Fajr, Dhuhr, Asr, Maghrib, Isha } = json.data.timings;
  return { Fajr, Dhuhr, Asr, Maghrib, Isha };
}

export async function fetchMosqueTimings(mosqueId: string): Promise<MosqueTimings | null> {
  const res = await fetch(`${API_BASE}/mosques/${mosqueId}/timings`);
  if (!res.ok) return null;
  return res.json();
}

export type NewMosque = {
  title: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  coordinate: { latitude: number; longitude: number };
};

export async function createMosque(mosque: NewMosque): Promise<Mosque> {
  const res = await fetch(`${API_BASE}/mosques`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mosque),
  });
  if (!res.ok) throw new Error(`Failed to create mosque: ${res.status}`);
  return res.json();
}

export async function patchMosqueTimings(
  mosqueId: string,
  fixed: Record<string, string>
): Promise<void> {
  const url = `${API_BASE}/mosques/${mosqueId}/timings`;
  console.log('[patchMosqueTimings] PATCH', url, JSON.stringify({ fixed }));
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fixed }),
    });
    console.log('[patchMosqueTimings] response status:', res.status);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[patchMosqueTimings] error body:', body);
      throw new Error(`Server error: ${res.status}`);
    }
  } catch (err) {
    console.error('[patchMosqueTimings] fetch threw:', err);
    throw err;
  }
}
