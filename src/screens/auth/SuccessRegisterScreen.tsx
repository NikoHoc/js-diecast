// src/screens/auth/SuccessRegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';

type SuccessRouteProp = RouteProp<RootStackParamList, 'SuccessRegister'>;

export default function SuccessRegisterScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<SuccessRouteProp>();
  const { login } = useAuth();
  
  const { apiKey, customer } = route.params;
  const [loading, setLoading] = useState(false);

  const handleStartShopping = async () => {
    setLoading(true);
    try {
      await login(apiKey, customer);
    } catch (error) {
      console.log('Error saving session:', error);
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      
      <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-8">
        <Ionicons name="checkmark-done" size={48} color="#22c55e" />
      </View>

      <Text className="text-3xl font-black text-gray-800 mb-3 text-center">Akun Berhasil Dibuat!</Text>
      
      <Text className="text-base text-gray-500 text-center mb-10">
        Selamat datang di JSDIECAST. Mulai jelajahi koleksi diecast impianmu dan nikmati berbagai keuntungan menarik dari kami.
      </Text>

      <TouchableOpacity 
        className="w-full bg-red-500 py-4 rounded-xl items-center flex-row justify-center shadow-sm"
        onPress={handleStartShopping}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Mulai Belanja</Text>
        )}
      </TouchableOpacity>
      
    </View>
  );
}