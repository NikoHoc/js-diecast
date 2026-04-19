import React from 'react';
import { View, Text } from 'react-native';
import LoginReminder from '@/components/LoginReminder';

export default function HistoryScreen() {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <LoginReminder subtitle="Silahkan login atau daftar akun untuk mengakses riwayat transaksi anda!" />
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">Halaman Riwayat Transaksi</Text>
    </View>
  );
}
