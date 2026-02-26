insert into mosques (id, title, address, location, phone, email, website) values
  ('1', 'East London Mosque',    '82-92 Whitechapel Rd, London E1 1JQ', ST_Point(-0.0606, 51.5183)::geography, '+44 20 7650 3000', null, 'https://www.eastlondonmosque.org.uk'),
  ('2', 'Finsbury Park Mosque',  '7-11 St Thomas''s Rd, London N4 2QH', ST_Point(-0.1063, 51.5649)::geography, '+44 20 7272 5741', null, null),
  ('3', 'Regent''s Park Mosque', '146 Park Rd, London NW8 7RG',         ST_Point(-0.1539, 51.5272)::geography, '+44 20 7724 3363', null, 'https://www.iccuk.org');

insert into mosque_timings (mosque_id, fajr, dhuhr, asr, maghrib, isha, updated_at, schedule) values
  ('1', '05:45', '13:15', '16:30', '+5', '21:00', '2026-02-22T00:00:00Z', '[]'),
  ('2', '05:50', '13:20', '16:35', '+5', '21:05', '2026-02-22T00:00:00Z', '[]'),
  ('3', '05:40', '13:10', '16:25', '+5', '20:55', '2026-02-22T00:00:00Z', '[]');
