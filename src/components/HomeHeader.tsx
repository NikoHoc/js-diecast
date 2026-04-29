import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import CartButton from './CartButton';

export default function HomeHeader() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (searchInput.trim().length > 0) {
      navigation.navigate('SearchProduct', { searchQuery: searchInput.trim() });
      setSearchInput('');
    }
  };
  return (
    <View className="rounded-b-3xl bg-red-500 px-4 pb-5" style={{ paddingTop: insets.top + 16 }}>
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-white">Hello, Diecaster</Text>
        <View className="flex-row items-center space-x-3 gap-2">
          <TouchableOpacity 
            onPress={() => console.log("Pergi ke PO Room")}
            className="rounded-xl bg-white/20 p-2 relative mr-1"
          >
            <Ionicons name="calendar-outline" size={20} color="white" />
            <View className="absolute top-0.5 right-0.5 bg-red-500 w-2.5 h-2.5 rounded-full border border-white" />
          </TouchableOpacity>
          <CartButton 
            iconName="cart" 
            iconColor="white" 
            size={20} 
            containerClassName="rounded-xl bg-white/20 p-2" 
          />
        </View>
      </View>
      <View className="flex-row items-center rounded-xl bg-white px-4 py-3">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput 
          placeholder="Cari mobil impianmu..." 
          className="flex-1 ml-2 text-gray-800"
          placeholderTextColor="gray"
          style={{ textAlignVertical: 'center', includeFontPadding: false }}
          value={searchInput}
          onChangeText={setSearchInput}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {searchInput.length > 0 && (
          <TouchableOpacity onPress={() => setSearchInput('')}>
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
