import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'; // 1. Import useRoute
import { RootStackParamList } from '@/types/navigation';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import GlobalProductCard from '@/components/GlobalProductCard'; 

const FILTER_OPTIONS = ['Semua', 'Ready', 'PO', 'Paket'];
const dummyPOItem = {
  id: 9999,
  name: "MINI GT 1/64 Nissan Skyline GT-R R34 Kaido House (Pre-Order)",
  photo: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=500&q=80", // Gambar placeholder mobil
  brand_name: "MINI GT",
  is_po: "1", // Penanda utama bahwa ini barang PO
  selling_price: "315000",
  ready_selling_price: "350000", // Harga coret (lebih mahal)
  po_selling_price: "315000", // Harga PO (harga promo)
  order_count: 24, // Jumlah peserta PO
  stock: 0 // PO biasanya tidak butuh stok ready
};

export default function SearchProductScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute(); // 2. Inisialisasi route

  // 3. Tangkap parameter dari halaman sebelumnya (misal: dilempar dari HomeScreen)
  const initialSearch = (route.params as any)?.searchQuery || '';

  // 4. Masukkan parameter awal ke state
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState('Semua');

  const { products, packages, loading, error, refetch } = useGlobalSearch(searchInput, activeFilter);

  const allResults = [dummyPOItem, ...packages, ...products];
  const isDataEmpty = allResults.length === 0;

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      
      {/* HEADER & SEARCH BAR */}
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput 
            autoFocus
            placeholder="Cari diecast impianmu..." 
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

      {/* FILTER & PABRIKAN BUTTON (SUDAH DIPERBAIKI) */}
      <View className="flex-row items-center px-4 py-2 bg-white border-b border-gray-100">
        {/* ScrollView dibatasi flex-1 dan diberi margin kanan (mr-2) */}
        <ScrollView 
          className="flex-1 mr-2" 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          // Hapus padding horizontal agar tidak dobel dengan px-4 di parent
        >
          {FILTER_OPTIONS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full mr-2 border ${
                  isActive ? 'bg-red-50 border-red-500' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`font-bold text-sm ${isActive ? 'text-red-500' : 'text-gray-500'}`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        {/* Garis pembatas kecil opsional untuk membedakan kategori dan pabrikan */}
        <View className="w-[1px] h-6 bg-gray-300 mr-2" />

        {/* Tombol Pabrikan */}
        <TouchableOpacity className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <Ionicons name="options" size={14} color="#374151" />
          <Text className="text-xs font-bold ml-1 text-gray-700">Pabrikan</Text>
        </TouchableOpacity>
      </View>

      {/* KONTEN PENCARIAN (GRID) */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Text className="text-gray-500 mt-3 font-medium">Mencari data...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cloud-offline-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-800 text-lg font-bold mt-4">Pencarian Gagal</Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">{error}</Text>
          <TouchableOpacity onPress={refetch} className="bg-red-500 px-6 py-3 rounded-xl flex-row items-center">
            <Ionicons name="refresh" size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold ml-2">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : isDataEmpty ? (
        <View className="flex-1 items-center justify-center py-20">
          <Ionicons name="search-outline" size={64} color="#E5E7EB" />
          <Text className="text-gray-500 text-base font-medium mt-4">
            {searchInput ? `"${searchInput}" tidak ditemukan` : 'Silakan ketik sesuatu untuk mencari'}
          </Text>
        </View>
      ) : (
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-between">
            {allResults.map((item, index) => (
              <GlobalProductCard 
                key={`search-item-${item.id || 'x'}-${index}`}
                item={item}
                onPress={() => {
                  navigation.navigate('ProductDetail', { productId: Number(item.id) });
                }}
              />
            ))}

            
          </View>
        </ScrollView>
      )}

    </View>
  );
}