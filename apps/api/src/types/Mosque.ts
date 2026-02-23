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

export type ScheduleEntry = {
  effectiveFrom: string; // "YYYY-MM-DD" — active until the next entry's date supersedes it
  updatedAt: string;     // ISO timestamp set by the server when this entry was saved
  fixed: IqamaFixed;
};

export type MosqueTimings = {
  mosqueId: string;
  fixed: IqamaFixed;
  updatedAt: string;       // ISO timestamp of the last direct edit to fixed
  schedule: ScheduleEntry[]; // sorted ascending by effectiveFrom
};
