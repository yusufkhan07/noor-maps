import type { Request, Response } from 'express';
import type { Mosque } from '../types/Mosque';

// Hardcoded for now — swap this out for a DB/Overpass query later
const MOSQUES: Mosque[] = [
  {
    id: '1',
    title: 'East London Mosque',
    description: '',
    coordinate: { latitude: 51.5183, longitude: -0.0606 },
    website: 'https://www.eastlondonmosque.org.uk',
    phone: '+44 20 7650 3000',
  },
  {
    id: '2',
    title: 'Finsbury Park Mosque',
    description: '',
    coordinate: { latitude: 51.5649, longitude: -0.1063 },
    phone: '+44 20 7272 5741',
  },
  {
    id: '3',
    title: "Regent's Park Mosque",
    description: '',
    coordinate: { latitude: 51.5272, longitude: -0.1539 },
    website: 'https://www.iccuk.org',
    phone: '+44 20 7724 3363',
  },
];

export function getMosques(_req: Request, res: Response): void {
  res.json(MOSQUES);
}
