import React, { useState, useEffect, act } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, getImageUrl } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { PRODUCT_FILTER_CATEGORIES } from '@/types';
import CartButton from '@/components/CartButton';

export default function SearchProductScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialQuery = route.params?.searchQuery || ''; 
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch(initialQuery, activeFilter);
  }, [initialQuery, activeFilter]);

  const handleSearch = async (query: string, filter: string) => {
    if (!query.trim() && filter === 'Semua') return;
    
    setLoading(true);
    let combinedData: any[] = [];
    const q = query.toLowerCase();

    // product
    if (filter === 'Semua' || filter === 'Ready') {
      try {
        const res = await api.get(`/catalog/products?search=${query}`);
        // const res = await api.get(`/product?search=${query}`);
        if (res?.success && res.data) {
          const mappedReady = res.data.map((p: any) => ({
            id: `ready-${p.id}`,
            type: 'ready',
            name: p.name,
            photo: getImageUrl(p.photo),
            selling_price: p.selling_price,
            stock: p.stock,
            brand: { name: p.brand_name || 'Pabrikan' }
          }));
          combinedData = [...combinedData, ...mappedReady];
        }
      } catch (error) {
        console.log("❌ Error di API Produk Ready:", error);
      }
    }

    // po_rooms
    if (filter === 'Semua' || filter === 'PO') {
      try {
        const res = await api.get(`/catalog/po_rooms`);
        if (res?.success && res.data) {
          const filtered = res.data.filter((po: any) => po.name.toLowerCase().includes(q));
          const mappedPO = filtered.map((po: any) => ({
            id: `po-${po.id}`,
            type: 'po',
            name: po.name,
            photo: getImageUrl(po.photo), 
            selling_price: po.po_selling_price, 
            stock: 'PRE-ORDER', 
            brand: { name: po.brand_name || 'PO Room' }
          }));
          combinedData = [...combinedData, ...mappedPO];
        }
      } catch (error) {
        console.log("❌ Error di API PO Room:", error);
      }
    }

    // package
    if (filter === 'Semua' || filter === 'Paket') {
      try {
        const res = await api.get(`/catalog/packages`);
        if (res?.success && res.data) {
          const filtered = res.data.filter((pkg: any) => pkg.name.toLowerCase().includes(q));
          const mappedPkg = filtered.map((pkg: any) => ({
            id: `paket-${pkg.id}`,
            type: 'paket',
            name: pkg.name,
            photo: getImageUrl(pkg.photo),
            selling_price: pkg.price, 
            stock: 'PAKET BUNDLING',
            brand: { name: 'Promo' }
          }));
          combinedData = [...combinedData, ...mappedPkg];
        }
      } catch (error) {
        console.log("❌ Error di API Paket Bundling:", error);
      }
    }

    // Terakhir, simpan data yang berhasil digabung ke State
    setResults(combinedData);
    setLoading(false);
  };

  const onSubmitSearch = () => {
    handleSearch(searchInput, activeFilter);
  };

  const onChangeFilter = (newFilter: string) => {
    setActiveFilter(newFilter);
    handleSearch(searchInput, newFilter);
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 space-x-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput 
            className="flex-1 ml-2 text-gray-800"
            placeholder="Cari diecast..."
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={onSubmitSearch}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={() => setSearchInput('')}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        <CartButton />
      </View>

      <View className="flex-row items-center px-4 py-3 border-b border-gray-50">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
          {PRODUCT_FILTER_CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat}
              onPress={() => onChangeFilter(cat)}
              className={`mr-2 px-4 py-1.5 rounded-full border ${activeFilter === cat ? 'bg-red-50 border-red-500' : 'bg-white border-gray-200'}`}
            >
              <Text className={`text-xs font-bold ${activeFilter === cat ? 'text-red-500' : 'text-gray-500'}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity className="ml-2 flex-row items-center bg-gray-200 px-3 py-1.5 rounded-full">
          <Ionicons name="options" size={14} color="black" />
          <Text className="text-xs font-bold ml-1">Pabrikan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-2 pt-4" showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#EF4444" className="mt-10" />
        ) : results.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <Ionicons name="search-outline" size={60} color="#E5E7EB" />
            <Text className="text-gray-500 font-medium mt-4">Produk tidak ditemukan</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap">
            {results.map((item) => (
              <ProductCard 
                key={item.id}
                product={item}
                onPress={() => console.log("Pergi ke detail:", item.id)}
              />
            ))}
          </View>
        )}
        <View className="h-10" />
      </ScrollView>

    </View>
  );
}