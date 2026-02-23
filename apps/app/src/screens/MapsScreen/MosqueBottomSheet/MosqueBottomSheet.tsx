import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Animated,
  Dimensions,
  Linking,
  PanResponder,
  ScrollView,
  View,
} from 'react-native';
import {
  AddTimingsModal,
  TimingsForm,
} from './AddTimingsModal/AddTimingsModal';
import { ActionBar } from './ActionBar/ActionBar';
import { MosqueHeader } from './MosqueHeader/MosqueHeader';
import { MosqueInfo } from './MosqueInfo/MosqueInfo';
import { useSaveTimings } from './mutations/useSaveTimings';
import { PrayerTimesTable } from './PrayerTimesTable/PrayerTimesTable';
import { styles } from './styles';
import { IqamahTimes, Mosque, PrayerTimes } from './types';

type Props = {
  mosque: Mosque | null;
  prayerTimes: PrayerTimes | null;
  iqamahTimes?: IqamahTimes | null;
  isLoading: boolean;
  onClose: () => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT;
const DISMISS_THRESHOLD = 80;

export const MosqueBottomSheet = ({
  isLoading,
  mosque,
  prayerTimes,
  iqamahTimes,
  onClose,
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
    }),
  ).current;

  const handleGetDirections = useCallback(() => {
    if (!mosque) return;
    const { latitude, longitude } = mosque.coordinate;

    const appleMapsUrl = `maps://?daddr=${latitude},${longitude}&dirflg=d`;
    const googleMapsNativeUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
    const googleMapsFallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Apple Maps', 'Google Maps'],
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          Linking.openURL(appleMapsUrl);
        } else if (buttonIndex === 2) {
          const canOpenGoogle = await Linking.canOpenURL(googleMapsNativeUrl);
          Linking.openURL(
            canOpenGoogle ? googleMapsNativeUrl : googleMapsFallbackUrl,
          );
        }
      },
    );
  }, [mosque]);

  const { mutateAsync: saveTimings } = useSaveTimings(() => {
    setShowAddTimings(false);
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

    const formEntryToApiValue = (entry: TimingsForm[keyof TimingsForm]) => {
      if (!entry) return undefined;
      if (entry.mode === 'relative') {
        return `+${entry.offsetMinutes}`;
      }
      const h = entry.time.getHours();
      const m = entry.time.getMinutes();
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    for (const [formKey, apiKey] of prayers) {
      const value = formEntryToApiValue(form[formKey]);
      if (value !== undefined) fixed[apiKey] = value;
    }

    await saveTimings({ mosqueId: mosque.id, fixed });
  };

  return (
    <>
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
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
              <MosqueHeader
                title={mosque.title}
                isFavourite={isFavourite}
                onToggleFavourite={() => setIsFavourite((f) => !f)}
              />

              <ActionBar
                onGetDirections={handleGetDirections}
                onEditTimings={() => setShowAddTimings(true)}
              />

              <View style={styles.divider} />

              <PrayerTimesTable
                prayerTimes={prayerTimes}
                iqamahTimes={iqamahTimes}
                isLoading={isLoading}
              />

              <View style={styles.divider} />

              <MosqueInfo mosque={mosque} />
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
