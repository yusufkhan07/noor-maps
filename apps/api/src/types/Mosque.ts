export type Mosque = {
  id: string;
  title: string;
  description: string;
  coordinate: { latitude: number; longitude: number };
  email?: string;
  website?: string;
  phone?: string;
};
