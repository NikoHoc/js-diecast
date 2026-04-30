import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { usePackages } from '@/hooks/usePackages';
import PackageCard from '@/components/PackageCard';
import CartButton from '@/components/CartButton';

export default function PackageScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [searchInput, setSearchInput] = useState('');
  
  const { packages, loading, error, refetch } = usePackages(searchInput);

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      
      <View className="flex-row items-center justify-between px-2 py-3 bg-white">
        <Text className="text-2xl font-bold ml-4 text-gray-800">Paket Bundling</Text>
        <CartButton />
      </View>

      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput 
            placeholder="Cari paket..." 
            className="ml-3 flex-1 text-gray-800 font-medium"
            placeholderTextColor="#9CA3AF"
            value={searchInput}
            onChangeText={setSearchInput}
            style={{ textAlignVertical: 'center', includeFontPadding: false }} 
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={() => setSearchInput('')} className="p-1">
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Text className="text-gray-500 mt-3 text-sm font-medium">Mencari paket terbaik...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-800 text-lg font-bold mt-4 text-center">Gagal Memuat Paket</Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">{error}</Text>
          <TouchableOpacity 
            onPress={refetch}
            className="bg-red-500 px-6 py-3 rounded-xl flex-row items-center shadow-sm"
          >
            <Ionicons name="refresh" size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold ml-2">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {packages.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="cube-outline" size={64} color="#E5E7EB" />
              <Text className="text-gray-500 text-base font-medium mt-4">Tidak ada paket yang ditemukan</Text>
            </View>
          ) : (
            packages.map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                onPress={() => {
                  navigation.navigate('ProductDetail', { productId: Number(pkg.id) });
                }} 
              />
            ))
          )}
        </ScrollView>
      )}

    </View>
  );
}