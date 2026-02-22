import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActionSheetIOS, Linking, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { MosqueBottomSheet, Mosque, PrayerTimes } from './MosqueBottomSheet';

// In Expo Go / dev builds, hostUri is the dev server address (e.g. "192.168.1.5:8081").
// Stripping the port gives us the machine's LAN IP, which works on both simulator and real device.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
const API_BASE = `http://${devHost}:3000`;

const RADIUS_METERS = 1000;

const INITIAL_REGION = {
  latitude: 51.5072,
  longitude: -0.1276,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export const MapsScreen = () => {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isPrayerTimesLoading, setIsPrayerTimesLoading] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetch(`${API_BASE}/mosques`)
      .then(r => r.json())
      .then(setMosques)
      .catch(() => setMosques([]));
  }, []);

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

  const handleMarkerPress = useCallback(async (mosque: Mosque) => {
    setSelectedMosque(mosque);
    setPrayerTimes(null);
    setIsPrayerTimesLoading(true);

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const { latitude, longitude } = mosque.coordinate;
      const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=2`;
      const response = await fetch(url);
      const json = await response.json();
      const { Fajr, Dhuhr, Asr, Maghrib, Isha } = json.data.timings;
      setPrayerTimes({ Fajr, Dhuhr, Asr, Maghrib, Isha });
    } catch {
      setPrayerTimes(null);
    } finally {
      setIsPrayerTimesLoading(false);
    }
  }, []);

  const handleSheetClose = useCallback(() => {
    setSelectedMosque(null);
    setPrayerTimes(null);
  }, []);

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
        prayerTimes={prayerTimes}
        isLoading={isPrayerTimesLoading}
        onClose={handleSheetClose}
        onGetDirections={handleGetDirections}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    fontSize: 28,
  },
});
