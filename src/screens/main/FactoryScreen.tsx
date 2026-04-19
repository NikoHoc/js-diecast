import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrands } from '@/hooks/useBrands';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import ImageWithFallback from '@/components/ImageWithFallback';
import CartButton from '@/components/CartButton';

export default function FactoryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [searchQuery, setSearchQuery] = useState('');
  const { brands, loading } = useBrands();

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      
      <View className="flex-row items-center justify-between px-2 py-3">
        <Text className="text-2xl font-bold ml-4 text-gray-800">Daftar Pabrikan</Text>
        <CartButton />
      </View>

      <View className="px-4 py-2 border-b border-gray-100 pb-4">
        <View className="flex-row items-center bg-gray-100/80 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput 
            placeholder="Cari..." 
            className="ml-2 flex-1 text-gray-800 p-0"
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

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Text className="text-gray-500 mt-2 text-sm">Memuat produsen...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {filteredBrands.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500 text-base">Produsen tidak ditemukan</Text>
            </View>
          ) : (
            filteredBrands.map((brand) => (
              <TouchableOpacity 
                key={brand.id} 
                className="flex-row items-center py-4 border-b border-gray-100"
                onPress={() => {
                  navigation.navigate('FactoryProduct', { 
                    brandId: brand.id, 
                    brandName: brand.name 
                  });
                }}
              >
                <View className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 items-center justify-center mr-4">
                  <ImageWithFallback 
                    uri={brand.logo} 
                    className="w-full h-full"
                    resizeMode="contain"
                    fallbackIcon="car-sport-outline"
                  />
                </View>
                
                <Text className="text-base font-semibold text-gray-800 flex-1">
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

    </View>
  );
}