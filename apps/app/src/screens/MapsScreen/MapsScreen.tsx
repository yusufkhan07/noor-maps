import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MapView, { Circle, MapPressEvent, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MosqueBottomSheet } from './MosqueBottomSheet/MosqueBottomSheet';
import { AddMosqueModal } from './AddMosqueModal/AddMosqueModal';
import { SearchBar } from './SearchBar/SearchBar';
import { useMosques } from './queries/useMosques';
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
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
const [pinnedLocation, setPinnedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showAddMosque, setShowAddMosque] = useState(false);
  const mapRef = useRef<MapView>(null);
  const tabBarOpacity = useRef(new Animated.Value(1)).current;
  const handleSelectResult = (latitude: number, longitude: number) => {
    mapRef.current?.animateToRegion(
      { latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      1000,
    );
  };

  const handleMapPress = (event: MapPressEvent) => {
    setPinnedLocation(event.nativeEvent.coordinate);
  };

  const handleAddMosqueClose = () => {
    setShowAddMosque(false);
    setPinnedLocation(null);
  };

  const mosques = useMosques();

  useEffect(() => {
    Animated.timing(tabBarOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    navigation.setOptions({
      tabBarStyle: { opacity: tabBarOpacity },
    });
  }, [navigation, tabBarOpacity]);

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
      {!selectedMosque && !pinnedLocation && (
        <SearchBar onSelectResult={handleSelectResult} onClear={() => {}} />
      )}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onPress={handleMapPress}
      >
{pinnedLocation && (
          <Marker coordinate={pinnedLocation} pinColor="green" />
        )}
        {mosques.map((mosque) => (
          <React.Fragment key={mosque.id}>
            <Marker
              coordinate={mosque.coordinate}
              tracksViewChanges={false}
              onPress={(e) => {
                e.stopPropagation();
                setPinnedLocation(null);
                setSelectedMosque(mosque);
              }}
            >
              <Text style={styles.marker}>🕌</Text>
            </Marker>
            <Circle
              center={mosque.coordinate}
              radius={RADIUS_METERS}
              strokeColor="rgba(0, 112, 200, 0.6)"
              strokeWidth={1.5}
              fillColor="rgba(0, 112, 200, 0.07)"
            />
            <Marker
              coordinate={{
                latitude: mosque.coordinate.latitude + 0.009,
                longitude: mosque.coordinate.longitude,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              tappable={false}
            >
              <View style={styles.radiusLabel}>
                <Text style={styles.radiusLabelText}>1 km</Text>
              </View>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      <Modal
        visible={!!pinnedLocation && !showAddMosque}
        transparent
        animationType="fade"
        onRequestClose={() => setPinnedLocation(null)}
      >
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={[styles.locationPopup, { marginBottom: insets.bottom + 24 }]}>
            <Text style={styles.locationPopupTitle}>What would you like to add here?</Text>
            <TouchableOpacity style={styles.locationPopupBtn} onPress={() => setShowAddMosque(true)}>
              <Text style={styles.locationPopupBtnText}>🕌  Add a Mosque</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPinnedLocation(null)}>
              <Text style={styles.locationPopupCancel}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MosqueBottomSheet
        mosque={selectedMosque}
        onClose={() => setSelectedMosque(null)}
      />

      {pinnedLocation && showAddMosque && (
        <AddMosqueModal
          visible={true}
          coordinate={pinnedLocation}
          onClose={handleAddMosqueClose}
          onSuccess={handleAddMosqueClose}
        />
      )}
    </View>
  );
};
