import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MosqueBottomSheet } from './MosqueBottomSheet/MosqueBottomSheet';
import { SearchBar } from './SearchBar/SearchBar';
import { useMosques } from './queries/useMosques';
import { usePrayerData } from './queries/usePrayerData';
import { styles } from './styles';
import { Mosque } from './MosqueBottomSheet/types';

const RADIUS_METERS = 1000;

const INITIAL_REGION = {
  latitude: 51.5072,
  longitude: -0.1276,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export const MapsScreen = () => {
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [searchPin, setSearchPin] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);

  const handleSelectResult = (latitude: number, longitude: number) => {
    setSearchPin({ latitude, longitude });
    mapRef.current?.animateToRegion(
      { latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      1000,
    );
  };

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

  return (
    <View style={styles.container}>
      <SearchBar onSelectResult={handleSelectResult} onClear={() => setSearchPin(null)} />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {searchPin && (
          <Marker coordinate={searchPin} pinColor="red" />
        )}
        {mosques.map((mosque) => (
          <React.Fragment key={mosque.id}>
            <Marker
              coordinate={mosque.coordinate}
              onPress={() => {
                setSelectedMosque(mosque);
              }}
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
        onClose={() => {
          setSelectedMosque(null);
        }}
      />
    </View>
  );
};
