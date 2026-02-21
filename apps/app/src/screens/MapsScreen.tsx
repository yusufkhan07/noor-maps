import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MapsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Maps</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    color: '#333333',
  },
});
