import * as http from 'node:http';

type Mosque = {
  id: string;
  title: string;
  description: string;
  coordinate: { latitude: number; longitude: number };
  email?: string;
  website?: string;
  phone?: string;
};

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
    title: 'Regent\'s Park Mosque',
    description: '',
    coordinate: { latitude: 51.5272, longitude: -0.1539 },
    website: 'https://www.iccuk.org',
    phone: '+44 20 7724 3363',
  },
];

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET' && url.pathname === '/mosques') {
    res.writeHead(200);
    res.end(JSON.stringify(MOSQUES));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Noor Maps API running on http://localhost:${PORT}`);
});
