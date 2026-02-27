export type Mosque = {
  id: string;
  title: string;
  description: string;
  address?: string;
  coordinate: { latitude: number; longitude: number };
  email?: string;
  website?: string;
  phone?: string;
  method?: number;
  school?: 0 | 1;
};

export type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export type IqamahTimes = Partial<PrayerTimes>;
