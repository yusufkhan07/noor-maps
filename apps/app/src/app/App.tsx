import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { FavouritesScreen } from '../screens/FavouritesScreen/FavouritesScreen';
import { MapsScreen } from '../screens/MapsScreen/MapsScreen';
import { MenuScreen } from '../screens/MenuScreen/MenuScreen';

const Tab = createBottomTabNavigator();

const FavouritesIcon = () => <Text style={{ fontSize: 22 }}>★</Text>;
const MapsIcon = () => <Text style={{ fontSize: 22 }}>🗺</Text>;
const MenuIcon = () => <Text style={{ fontSize: 22 }}>☰</Text>;

export const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Maps"
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Favourites" component={FavouritesScreen} options={{ tabBarIcon: FavouritesIcon }} />
        <Tab.Screen name="Maps" component={MapsScreen} options={{ tabBarIcon: MapsIcon }} />
        <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarIcon: MenuIcon }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
