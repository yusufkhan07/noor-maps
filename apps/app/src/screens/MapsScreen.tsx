import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

const MOSQUES = [
  {
    id: '1',
    title: 'Mosque 1',
    description: 'Description for mosque 1',
    coordinate: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: '2',
    title: 'Mosque 2',
    description: 'Description for mosque 2',
    coordinate: {
      latitude: 37.7849,
      longitude: -122.4094,
    },
  },
];

// 1km radius in degrees (approximate): 1km ≈ 0.009 degrees
const RADIUS_METERS = 1000;

const DEFAULT_MOSQUE = MOSQUES[0];

const INITIAL_REGION = {
  latitude: DEFAULT_MOSQUE.coordinate.latitude,
  longitude: DEFAULT_MOSQUE.coordinate.longitude,
  latitudeDelta: 0.018,
  longitudeDelta: 0.018,
};

export const MapsScreen = () => {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={INITIAL_REGION}>
        {MOSQUES.map((mosque) => (
          <React.Fragment key={mosque.id}>
            <Marker coordinate={mosque.coordinate} title={mosque.title} description={mosque.description}>
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
