import { useQuery } from '@tanstack/react-query';
import { fetchAladhanTimings, fetchMosqueTimings } from '../../../api';
import type { Mosque, PrayerTimes, IqamahTimes } from '../../MosqueBottomSheet/MosqueBottomSheet';

function to12h(time: string): string {
  const [hourStr, minStr] = time.split(':');
  const h = Number.parseInt(hourStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minStr} ${ampm}`;
}

function resolveIqamahTime(value: string | undefined, adhan: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith('+')) {
    const offset = Number.parseInt(value.slice(1), 10);
    if (Number.isNaN(offset)) return undefined;
    const [hourStr, minStr] = adhan.split(':');
    const total = Number.parseInt(hourStr, 10) * 60 + Number.parseInt(minStr, 10) + offset;
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return to12h(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  return to12h(value);
}

type PrayerData = {
  prayerTimes: PrayerTimes;
  iqamahTimes: IqamahTimes | null;
};

export function usePrayerData(mosque: Mosque | null): {
  prayerData: PrayerData | undefined;
  isLoading: boolean;
} {
  const { data: prayerData, isFetching: isLoading } = useQuery({
    queryKey: ['prayerData', mosque?.id],
    enabled: !!mosque,
    queryFn: async (): Promise<PrayerData> => {
      const { latitude, longitude } = mosque!.coordinate;
      const [adhan, timings] = await Promise.all([
        fetchAladhanTimings(latitude, longitude),
        fetchMosqueTimings(mosque!.id),
      ]);

      const prayerTimes: PrayerTimes = {
        Fajr: to12h(adhan.Fajr),
        Dhuhr: to12h(adhan.Dhuhr),
        Asr: to12h(adhan.Asr),
        Maghrib: to12h(adhan.Maghrib),
        Isha: to12h(adhan.Isha),
      };

      let iqamahTimes: IqamahTimes | null = null;
      if (timings) {
        const f = timings.fixed;
        iqamahTimes = {
          Fajr: resolveIqamahTime(f.fajr, adhan.Fajr),
          Dhuhr: resolveIqamahTime(f.dhuhr, adhan.Dhuhr),
          Asr: resolveIqamahTime(f.asr, adhan.Asr),
          Maghrib: resolveIqamahTime(f.maghrib, adhan.Maghrib),
          Isha: resolveIqamahTime(f.isha, adhan.Isha),
        };
      }

      return { prayerTimes, iqamahTimes };
    },
  });

  return { prayerData, isLoading };
}
