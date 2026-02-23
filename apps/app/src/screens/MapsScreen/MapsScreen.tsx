import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActionSheetIOS, Linking, Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MosqueBottomSheet, Mosque, PrayerTimes, IqamahTimes } from '../MosqueBottomSheet/MosqueBottomSheet';
import { fetchMosques, fetchAladhanTimings, fetchMosqueTimings } from '../../api';
import { styles } from './styles';

const RADIUS_METERS = 1000;

const INITIAL_REGION = {
  latitude: 51.5072,
  longitude: -0.1276,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

// Converts a 24h "HH:MM" string to 12h "H:MM AM/PM".
function to12h(time: string): string {
  const [hourStr, minStr] = time.split(':');
  const h = Number.parseInt(hourStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minStr} ${ampm}`;
}

// Resolves an iqamah time value against the adhan time.
// "+N" means N minutes after adhan → returns absolute "H:MM AM/PM".
// "HH:MM" is returned as 12h. Anything else (empty, undefined) returns undefined.
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

export const MapsScreen = () => {
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const mapRef = useRef<MapView>(null);
  const queryClient = useQueryClient();

  const { data: mosques = [] } = useQuery({
    queryKey: ['mosques'],
    queryFn: fetchMosques,
  });

  const { data: prayerData, isFetching: isPrayerTimesLoading } = useQuery({
    queryKey: ['prayerData', selectedMosque?.id],
    enabled: !!selectedMosque,
    queryFn: async () => {
      const { latitude, longitude } = selectedMosque!.coordinate;
      const [adhan, timings] = await Promise.all([
        fetchAladhanTimings(latitude, longitude),
        fetchMosqueTimings(selectedMosque!.id),
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

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      mapRef.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.018,
          longitudeDelta: 0.018,
        },
        1000
      );
    })();
  }, []);

  const handleMarkerPress = useCallback((mosque: Mosque) => {
    setSelectedMosque(mosque);
  }, []);

  const handleSheetClose = useCallback(() => {
    setSelectedMosque(null);
  }, []);

  const handleTimingsUpdated = useCallback(() => {
    if (!selectedMosque) return;
    queryClient.invalidateQueries({ queryKey: ['prayerData', selectedMosque.id] });
  }, [selectedMosque, queryClient]);

  const handleGetDirections = useCallback(() => {
    if (!selectedMosque) return;
    const { latitude, longitude } = selectedMosque.coordinate;

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
          Linking.openURL(canOpenGoogle ? googleMapsNativeUrl : googleMapsFallbackUrl);
        }
      }
    );
  }, [selectedMosque]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {mosques.map((mosque) => (
          <React.Fragment key={mosque.id}>
            <Marker
              coordinate={mosque.coordinate}
              onPress={() => handleMarkerPress(mosque)}
            >
              <Text style={styles.marker}>🕌</Text>
            </Marker>
            <Circle
              center={mosque.coordinate}
              radius={RADIUS_METERS}
              strokeColor="rgba(0, 120, 200, 0.5)"
              fillColor="rgba(0, 120, 200, 0.1)"
            />
          </React.Fragment>
        ))}
      </MapView>

      <MosqueBottomSheet
        mosque={selectedMosque}
        prayerTimes={prayerData?.prayerTimes ?? null}
        iqamahTimes={prayerData?.iqamahTimes ?? null}
        isLoading={isPrayerTimesLoading}
        onClose={handleSheetClose}
        onGetDirections={handleGetDirections}
        onTimingsUpdated={handleTimingsUpdated}
      />
    </View>
  );
};
