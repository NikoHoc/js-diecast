import LoginReminder from '@/components/LoginReminder';
import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <LoginReminder subtitle="Silahkan login atau daftar akun untuk mengakses profile anda!" />
    );
  }
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">Halaman Pengaturan User</Text>
    </View>
  );
}
