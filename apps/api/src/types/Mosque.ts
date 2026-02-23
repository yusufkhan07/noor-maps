export type Mosque = {
  id: string;
  title: string;
  address: string;
  coordinate: { latitude: number; longitude: number };
  phone?: string;
  email?: string;
  website?: string;
};

export type IqamaFixed = {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string; // absolute time "HH:mm" or relative offset "+N" minutes after adhan
  isha: string;
};

export type MosqueTimings = {
  mosqueId: string;
  fixed: IqamaFixed;
  // schedule will be added here later for date/month-based timings
};
