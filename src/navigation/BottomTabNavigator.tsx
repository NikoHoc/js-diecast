import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import FactoryScreen from '../screens/main/FactoryScreen';
import PointScreen from '../screens/main/PointScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#EF4444',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          height: 75,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Beranda') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Pabrikan') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Tukar Point') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Riwayat') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Pengaturan') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Pabrikan" component={FactoryScreen} />
      <Tab.Screen name="Tukar Point" component={PointScreen} />
      <Tab.Screen name="Riwayat" component={HistoryScreen} />
      <Tab.Screen name="Pengaturan" component={ProfileScreen} />
    </Tab.Navigator>
  );
}