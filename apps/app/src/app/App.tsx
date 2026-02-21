import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { FavouritesScreen } from '../screens/FavouritesScreen';
import { MapsScreen } from '../screens/MapsScreen';
import { MenuScreen } from '../screens/MenuScreen';

const Tab = createBottomTabNavigator();

export const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Maps"
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen
          name="Favourites"
          component={FavouritesScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 22 }}>★</Text>,
          }}
        />
        <Tab.Screen
          name="Maps"
          component={MapsScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 22 }}>🗺</Text>,
          }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 22 }}>☰</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
