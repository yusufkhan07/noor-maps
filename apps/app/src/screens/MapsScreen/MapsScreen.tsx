import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActionSheetIOS, Linking, Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useQueryClient } from '@tanstack/react-query';
import {
  MosqueBottomSheet,
  Mosque,
} from './MosqueBottomSheet/MosqueBottomSheet';
import { useMosques } from './queries/useMosques';
import { usePrayerData } from './queries/usePrayerData';
import { styles } from './styles';

const RADIUS_METERS = 1000;

const INITIAL_REGION = {
  latitude: 51.5072,
  longitude: -0.1276,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export const MapsScreen = () => {
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const mapRef = useRef<MapView>(null);
  const queryClient = useQueryClient();

  const mosques = useMosques();
  const { prayerData, isLoading: isPrayerTimesLoading } =
    usePrayerData(selectedMosque);

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
        1000,
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
    queryClient.invalidateQueries({
      queryKey: ['prayerData', selectedMosque.id],
    });
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
          Linking.openURL(
            canOpenGoogle ? googleMapsNativeUrl : googleMapsFallbackUrl,
          );
        }
      },
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
