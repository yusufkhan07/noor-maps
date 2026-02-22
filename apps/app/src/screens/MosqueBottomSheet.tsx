import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddTimingsModal } from './AddTimingsModal';

export type Mosque = {
  id: string;
  title: string;
  description: string;
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

export const MosqueBottomSheet = ({
  mosque,
  prayerTimes,
  iqamahTimes,
  isLoading,
  onClose,
  onGetDirections,
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
                <Text style={styles.actionChipLabel}>Add / Update Timings</Text>
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
              <ContactRow icon="✉" label={mosque.email} placeholder="Email not listed" />
              <ContactRow icon="🌐" label={mosque.website} placeholder="Website not listed" />
              <ContactRow icon="📞" label={mosque.phone} placeholder="Phone not listed" />
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
        onSubmit={() => setShowAddTimings(false)}
      />
    )}
    </>
  );
};

type ContactRowProps = {
  icon: string;
  label?: string;
  placeholder: string;
};

const ContactRow = ({ icon, label, placeholder }: ContactRowProps) => (
  <View style={styles.contactRow}>
    <Text style={styles.contactIcon}>{icon}</Text>
    <Text style={[styles.contactLabel, !label && styles.missingValue]}>
      {label ?? placeholder}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Header
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mosqueName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  favButton: {
    padding: 4,
  },
  favIcon: {
    fontSize: 24,
    color: '#ccc',
  },
  favIconActive: {
    color: '#e63946',
  },

  // Action chips
  actionRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  actionChipLast: {
    marginRight: 4,
  },
  actionChipIcon: {
    fontSize: 14,
    color: '#1a6b3c',
  },
  actionChipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Divider
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },

  // Prayer times table
  prayerTimesContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
    marginBottom: 2,
  },
  colHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colPrayer: {
    flex: 1.2,
  },
  colTime: {
    flex: 1,
    textAlign: 'right',
  },
  loader: {
    marginVertical: 16,
  },
  prayerRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8e8e8',
  },
  prayerLabel: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  prayerTime: {
    fontSize: 15,
    color: '#1a6b3c',
    fontWeight: '600',
  },
  missingValue: {
    color: '#bbb',
    fontWeight: '400',
  },
  errorText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },

  // Contact section
  contactSection: {
    gap: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  contactLabel: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
});
