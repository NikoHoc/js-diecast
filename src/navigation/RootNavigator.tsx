import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import { RootStackParamList } from '@/types/navigation';
import FactoryProductScreen from '../screens/product/FactoryProductScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      
      <Stack.Screen name="FactoryProduct" component={FactoryProductScreen} />

    </Stack.Navigator>
  );
}