import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface LoginReminderProps {
  title?: string;
  subtitle?: string;
}

export default function LoginReminder({ 
  title = "Kamu Belum Login", 
  subtitle = "Silakan login atau daftar untuk mengakses fitur ini secara penuh." 
}: LoginReminderProps) {
  
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6 p-4">
      <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center mb-6">
        <Ionicons name="person-circle-outline" size={60} color="#EF4444" />
      </View>
      
      <Text className="text-xl font-bold text-gray-800 text-center mb-2">
        {title}
      </Text>
      <Text className="text-base text-gray-500 text-center mb-8 leading-6">
        {subtitle}
      </Text>
      
      <TouchableOpacity 
        className="w-full bg-red-500 py-4 rounded-xl items-center shadow-sm"
        onPress={() => navigation.navigate('Login' as never)}
      >
        <Text className="text-white font-bold text-base">Login / Daftar Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}