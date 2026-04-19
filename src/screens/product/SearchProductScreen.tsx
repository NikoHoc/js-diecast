import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';

export default function SearchProductScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SearchProduct'>>();

  const { searchQuery: initialQuery } = route.params;

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);

  const { products, loading } = useProducts(undefined, currentQuery);

  const handleSearchAgain = () => {
    if (searchInput.trim().length > 0) {
      setCurrentQuery(searchInput.trim());
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <ProductCard
      key={item.id}
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    />
  );

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <Ionicons name="search" size={18} color="gray" />
          <TextInput 
            placeholder="Cari lagi..." 
            className="flex-1 ml-2 text-gray-800 p-0"
            style={{ textAlignVertical: 'center', includeFontPadding: false }}
            value={searchInput}
            onChangeText={setSearchInput}
            returnKeyType="search"
            onSubmitEditing={handleSearchAgain}
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={() => setSearchInput('')}>
              <Ionicons name="close-circle" size={18} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity className="p-2" onPress={() => console.log('Buka Keranjang')}>
          <Ionicons name="cart-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {!loading && (
        <View className="px-4 py-3 bg-gray-50/50">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-tight">
            Menampilkan hasil untuk &quot;{currentQuery}&quot; ({products.length})
          </Text>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductCard}
          numColumns={2}
          contentContainerStyle={{ padding: 8, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ionicons name="search-outline" size={60} color="#D1D5DB" />
              <Text className="mt-4 text-base font-medium text-gray-500">
                Produk &quot;{currentQuery}&quot; tidak ditemukan
              </Text>
              <Text className="mt-1 text-sm text-gray-400">Coba gunakan kata kunci lain</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
