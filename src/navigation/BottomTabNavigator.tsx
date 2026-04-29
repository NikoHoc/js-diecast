import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import FactoryScreen from '../screens/main/FactoryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import PackageScreen from '@/screens/main/PackageScreen';
import MembershipScreen from '../screens/main/MembershipScreen';

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

          if (route.name === 'Beranda') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Paket') iconName = focused ? 'file-tray-stacked' : 'file-tray-stacked-outline';
          else if (route.name === 'Pabrikan') iconName = focused ? 'storefront' : 'storefront-outline';
          else if (route.name === 'Membership') iconName = focused ? 'layers' : 'layers-outline';
          else if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Paket" component={PackageScreen} />
      <Tab.Screen name="Pabrikan" component={FactoryScreen} />
      <Tab.Screen name="Membership" component={MembershipScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}