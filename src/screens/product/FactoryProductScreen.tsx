import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useProducts } from '@/hooks/useProducts';
import { RootStackParamList } from '@/types/navigation';
import { formatRupiah } from '@/utils/formatters';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Product } from '@/types';

export default function FactoryProductScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const route = useRoute<RouteProp<RootStackParamList, 'FactoryProduct'>>();
  const brandId = route.params?.brandId || 1; 
  const brandName = route.params?.brandName || 'Nama Produsen';

  const { products, loading } = useProducts(brandId);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity className="w-1/2 p-2" onPress={() => console.log('Buka Detail Produk', item.id)}>
      <View className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <View className="h-40 bg-gray-50 items-center justify-center">
          <ImageWithFallback 
            uri={item.photo} 
            className="w-full h-full"
            resizeMode="cover"
            fallbackIcon="cube-outline" 
          />
        </View>

        <View className="p-3">
          <Text className="text-sm text-gray-800" numberOfLines={2} style={{ height: 40 }}>
            {item.name}
          </Text>
          <Text className="text-base font-bold text-red-500 mt-1">
            {formatRupiah(item.selling_price)}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-xs text-gray-500">Stok: {item.stock}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold ml-4 text-gray-800 uppercase">
            {brandName}
          </Text>
        </View>
        <TouchableOpacity className="p-2" onPress={() => console.log('Buka Keranjang')}>
          <Ionicons name="cart-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      <View className="px-4 py-2">
        <View className="flex-row items-center bg-gray-100/80 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput 
            placeholder={`Cari produk di ${brandName}...`} 
            className="ml-2 flex-1 text-base text-gray-800"
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="px-4 py-2 border-b border-gray-100 flex-row justify-between items-center">
        <Text className="text-sm font-semibold text-gray-600">
          {filteredProducts.length} Produk
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductCard}
          numColumns={2}
          contentContainerStyle={{ padding: 8, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-gray-500">Produk tidak ditemukan</Text>
            </View>
          }
        />
      )}
    </View>
  );
}