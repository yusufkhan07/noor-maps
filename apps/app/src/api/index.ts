import Constants from 'expo-constants';
import type { Mosque } from '../screens/MosqueBottomSheet/MosqueBottomSheet';

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

export async function patchMosqueTimings(
  mosqueId: string,
  fixed: Record<string, string>
): Promise<void> {
  const res = await fetch(`${API_BASE}/mosques/${mosqueId}/timings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fixed }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
}
