import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type Mosque = {
  id: string;
  title: string;
  description: string;
  coordinate: { latitude: number; longitude: number };
};

export type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

type Props = {
  mosque: Mosque | null;
  prayerTimes: PrayerTimes | null;
  isLoading: boolean;
  onClose: () => void;
  onGetDirections: () => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.42;
const DISMISS_THRESHOLD = SHEET_HEIGHT * 0.35;

const PRAYER_LABELS: [keyof PrayerTimes, string][] = [
  ['Fajr', 'Fajr'],
  ['Dhuhr', 'Dhuhr'],
  ['Asr', 'Asr'],
  ['Maghrib', 'Maghrib'],
  ['Isha', 'Isha'],
];

export const MosqueBottomSheet = ({ mosque, prayerTimes, isLoading, onClose, onGetDirections }: Props) => {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

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
    <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
      <View style={styles.handleArea} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>

      <View style={styles.content}>
        {mosque && (
          <>
            <Text style={styles.mosqueName}>{mosque.title}</Text>

            <View style={styles.prayerTimesContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#1a6b3c" style={styles.loader} />
              ) : prayerTimes ? (
                PRAYER_LABELS.map(([key, label]) => (
                  <View key={key} style={styles.prayerRow}>
                    <Text style={styles.prayerLabel}>{label}</Text>
                    <Text style={styles.prayerTime}>{prayerTimes[key]}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.errorText}>Could not load prayer times.</Text>
              )}
            </View>

            <TouchableOpacity style={styles.directionsButton} onPress={onGetDirections}>
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  mosqueName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  prayerTimesContainer: {
    marginBottom: 20,
  },
  loader: {
    marginVertical: 16,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  errorText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
  directionsButton: {
    backgroundColor: '#1a6b3c',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
