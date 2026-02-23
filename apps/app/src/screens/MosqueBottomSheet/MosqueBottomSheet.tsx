import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { AddTimingsModal, TimingsForm } from '../AddTimingsModal/AddTimingsModal';
import { patchMosqueTimings } from '../../api';
import { styles } from './styles';

export type Mosque = {
  id: string;
  title: string;
  description: string;
  address?: string;
  coordinate: { latitude: number; longitude: number };
  email?: string;
  website?: string;
  phone?: string;
};

export type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export type IqamahTimes = Partial<PrayerTimes>;

type Props = {
  mosque: Mosque | null;
  prayerTimes: PrayerTimes | null;
  iqamahTimes?: IqamahTimes | null;
  isLoading: boolean;
  onClose: () => void;
  onGetDirections: () => void;
  onTimingsUpdated: () => void;
  onReportMistake?: () => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
// Used only for the initial off-screen position and dismiss animation.
// The sheet itself sizes to its content via maxHeight.
const SHEET_HEIGHT = SCREEN_HEIGHT;
const DISMISS_THRESHOLD = 80;

const PRAYER_LABELS: [keyof PrayerTimes, string][] = [
  ['Fajr', 'Fajr'],
  ['Dhuhr', 'Dhuhr'],
  ['Asr', 'Asr'],
  ['Maghrib', 'Maghrib'],
  ['Isha', 'Isha'],
];

type ContactRowProps = {
  icon: string;
  label?: string;
  placeholder: string;
};

const ContactRow = ({ icon, label, placeholder }: ContactRowProps) => (
  <View style={styles.contactRow}>
    <Text style={styles.contactIcon}>{icon}</Text>
    <Text style={[styles.contactLabel, !label && styles.missingValue]}>
      {label || placeholder}
    </Text>
  </View>
);

// Converts a PrayerEntry from the form into an IqamaFixed-compatible string.
// Fixed mode → "HH:MM" (24h). Relative mode → "+N".
function formEntryToApiValue(entry: TimingsForm[keyof TimingsForm]): string | undefined {
  if (!entry) return undefined;
  if (entry.mode === 'relative') {
    return `+${entry.offsetMinutes}`;
  }
  const h = entry.time.getHours();
  const m = entry.time.getMinutes();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const MosqueBottomSheet = ({
  mosque,
  prayerTimes,
  iqamahTimes,
  isLoading,
  onClose,
  onGetDirections,
  onTimingsUpdated,
  onReportMistake,
}: Props) => {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [isFavourite, setIsFavourite] = useState(false);
  const [showAddTimings, setShowAddTimings] = useState(false);

  useEffect(() => {
    if (mosque) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [mosque, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DISMISS_THRESHOLD) {
          Animated.timing(translateY, {
            toValue: SHEET_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  const { mutateAsync: saveTimings } = useMutation({
    mutationFn: ({ mosqueId, fixed }: { mosqueId: string; fixed: Record<string, string> }) =>
      patchMosqueTimings(mosqueId, fixed),
    onSuccess: () => {
      setShowAddTimings(false);
      onTimingsUpdated();
    },
  });

  const handleSubmitTimings = async (form: TimingsForm): Promise<void> => {
    if (!mosque) return;

    const fixed: Record<string, string> = {};
    const prayers: [keyof TimingsForm, string][] = [
      ['Fajr', 'fajr'],
      ['Dhuhr', 'dhuhr'],
      ['Asr', 'asr'],
      ['Maghrib', 'maghrib'],
      ['Isha', 'isha'],
    ];
    for (const [formKey, apiKey] of prayers) {
      const value = formEntryToApiValue(form[formKey]);
      if (value !== undefined) fixed[apiKey] = value;
    }

    await saveTimings({ mosqueId: mosque.id, fixed });
  };

  return (
    <>
    <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
      {/* Drag handle */}
      <View style={styles.handleArea} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mosque && (
          <>
            {/* Name + favourite */}
            <View style={styles.nameRow}>
              <Text style={styles.mosqueName}>{mosque.title}</Text>
              <TouchableOpacity onPress={() => setIsFavourite(f => !f)} style={styles.favButton}>
                <Text style={[styles.favIcon, isFavourite && styles.favIconActive]}>
                  {isFavourite ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action chips — Google Maps style */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.actionRow}
            >
              <TouchableOpacity style={styles.actionChip} onPress={onGetDirections}>
                <Text style={styles.actionChipIcon}>↗</Text>
                <Text style={styles.actionChipLabel}>Directions</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionChip} onPress={() => setShowAddTimings(true)}>
                <Text style={styles.actionChipIcon}>✎</Text>
                <Text style={styles.actionChipLabel}>Edit Timings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionChip, styles.actionChipLast]} onPress={onReportMistake}>
                <Text style={styles.actionChipIcon}>⚑</Text>
                <Text style={styles.actionChipLabel}>Report a Mistake</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.divider} />

            {/* Prayer times table */}
            <View style={styles.prayerTimesContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.colHeader, styles.colPrayer]}>Prayer</Text>
                <Text style={[styles.colHeader, styles.colTime]}>Adhan</Text>
                <Text style={[styles.colHeader, styles.colTime]}>Iqamah</Text>
              </View>

              {isLoading ? (
                <ActivityIndicator size="small" color="#1a6b3c" style={styles.loader} />
              ) : prayerTimes ? (
                PRAYER_LABELS.map(([key, label]) => {
                  const iqamah = iqamahTimes?.[key];
                  return (
                    <View key={key} style={styles.prayerRow}>
                      <Text style={[styles.prayerLabel, styles.colPrayer]}>{label}</Text>
                      <Text style={[styles.prayerTime, styles.colTime]}>{prayerTimes[key]}</Text>
                      <Text style={[styles.prayerTime, styles.colTime, !iqamah && styles.missingValue]}>
                        {iqamah ?? '—'}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.errorText}>Could not load prayer times.</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Contact info */}
            <View style={styles.contactSection}>
              <ContactRow icon="📍" label={mosque.address} placeholder="Not available" />
              <ContactRow icon="✉" label={mosque.email} placeholder="Not available" />
              <ContactRow icon="🌐" label={mosque.website} placeholder="Not available" />
              <ContactRow icon="📞" label={mosque.phone} placeholder="Not available" />
            </View>
          </>
        )}
      </ScrollView>
    </Animated.View>

    {mosque && (
      <AddTimingsModal
        visible={showAddTimings}
        mosqueName={mosque.title}
        onClose={() => setShowAddTimings(false)}
        onSubmit={handleSubmitTimings}
      />
    )}
    </>
  );
};
