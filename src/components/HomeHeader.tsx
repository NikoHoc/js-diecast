import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="bg-red-500 pb-5 px-4 rounded-b-3xl" 
      style={{ paddingTop: insets.top + 16 }}
    >
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-white text-2xl font-bold">Hello, Diecaster</Text>
        <TouchableOpacity className="bg-white/20 p-2 rounded-xl">
          <Ionicons name="cart" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Cari diecast impianmu..."
          className="flex-1 ml-2 text-base text-gray-800"
          placeholderTextColor="gray"
        />
      </View>
    </View>
  );
}