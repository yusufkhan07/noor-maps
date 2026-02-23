import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from './styles';
import { IqamahTimes, PrayerTimes } from '../types';

const PRAYER_LABELS: [keyof PrayerTimes, string][] = [
  ['Fajr', 'Fajr'],
  ['Dhuhr', 'Dhuhr'],
  ['Asr', 'Asr'],
  ['Maghrib', 'Maghrib'],
  ['Isha', 'Isha'],
];

type Props = {
  prayerTimes: PrayerTimes | null;
  iqamahTimes?: IqamahTimes | null;
  isLoading: boolean;
};

const PrayerRows = ({ prayerTimes, iqamahTimes }: { prayerTimes: PrayerTimes; iqamahTimes?: IqamahTimes | null }) => (
  <>
    {PRAYER_LABELS.map(([key, label]) => {
      const iqamah = iqamahTimes?.[key];
      return (
        <View key={key} style={styles.prayerRow}>
          <Text style={[styles.prayerLabel, styles.colPrayer]}>{label}</Text>
          <Text style={[styles.prayerTime, styles.colTime]}>{prayerTimes[key]}</Text>
          <Text
            style={[
              styles.prayerTime,
              styles.colTime,
              !iqamah && styles.missingValue,
            ]}
          >
            {iqamah ?? '—'}
          </Text>
        </View>
      );
    })}
  </>
);

export const PrayerTimesTable = ({ prayerTimes, iqamahTimes, isLoading }: Props) => {
  let content: React.ReactNode;
  if (isLoading) {
    content = <ActivityIndicator size="small" color="#1a6b3c" style={styles.loader} />;
  } else if (prayerTimes) {
    content = <PrayerRows prayerTimes={prayerTimes} iqamahTimes={iqamahTimes} />;
  } else {
    content = <Text style={styles.errorText}>Could not load prayer times.</Text>;
  }

  return (
    <View style={styles.prayerTimesContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.colHeader, styles.colPrayer]}>Prayer</Text>
        <Text style={[styles.colHeader, styles.colTime]}>Adhan</Text>
        <Text style={[styles.colHeader, styles.colTime]}>Iqamah</Text>
      </View>
      {content}
    </View>
  );
};
