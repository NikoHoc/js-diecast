import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import CartButton from '@/components/CartButton';

export default function PackageScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-2 py-3">
        <Text className="ml-4 text-2xl font-bold text-gray-800">Paket Bundling</Text>
        <CartButton />
      </View>

      <View className="border-b border-gray-100 px-4 py-2 pb-4">
        <View className="flex-row items-center rounded-lg bg-gray-100/80 px-4 py-3">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Cari..."
            className="ml-2 flex-1 text-gray-800"
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ textAlignVertical: 'center', includeFontPadding: false }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        {/* <ActivityIndicator size="large" color="#EF4444" /> */}
        <Text className="">Coming Soon 🤩</Text>
      </View>
    </View>
  );
}
