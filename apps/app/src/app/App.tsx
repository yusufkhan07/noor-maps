import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavouritesScreen } from '../screens/FavouritesScreen/FavouritesScreen';
import { MapsScreen } from '../screens/MapsScreen/MapsScreen';
import { MenuScreen } from '../screens/MenuScreen/MenuScreen';
import { AuthProvider } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const FavouritesIcon = () => <Text style={{ fontSize: 22 }}>★</Text>;
const MapsIcon = () => <Text style={{ fontSize: 22 }}>🗺</Text>;
const MenuIcon = () => <Text style={{ fontSize: 22 }}>☰</Text>;

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
