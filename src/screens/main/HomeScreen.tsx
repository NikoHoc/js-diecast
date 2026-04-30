import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import HomeHeader from '@/components/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useHomeStats } from '@/hooks/useStats';
import BestSellerProductCard from '@/components/BestSellerProductCard';
import { usePackages } from '@/hooks/usePackages';
import HighlightPackageCard from '@/components/HighlightPackageCard';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32; 

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();

  const { packages, loading: packagesLoading, error: packagesError, refetch: refetchPackages } = usePackages();
  const { topBrands, topProducts, loading: statsLoading, error: statsError, refetch: refetchStats } = useHomeStats();

  const popularBrands = topBrands.slice(0, 8);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!packages || packages.length === 0) return;

    const intervalId = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= packages.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [currentIndex, packages?.length]);

  const SectionError = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
    <View className="py-6 items-center bg-gray-50 rounded-2xl border border-gray-100 mb-4">
      <Ionicons name="cloud-offline-outline" size={32} color="#9CA3AF" />
      <Text className="text-gray-500 font-medium mt-2 mb-3 text-center px-4">{message}</Text>
      <TouchableOpacity 
        onPress={onRetry} 
        className="flex-row items-center bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm"
      >
        <Ionicons name="refresh" size={16} color="#EF4444" />
        <Text className="text-red-500 font-bold ml-2 text-sm">Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <HomeHeader />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-800">Spesial Bundling</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Paket' as never)}>
                <Text className="text-sm font-bold text-red-500">Lihat Semua</Text>
              </TouchableOpacity>
            </View>

            {packagesLoading ? (
              <ActivityIndicator size="large" color="#EF4444" className="my-10" />
            ) : packagesError ? (
              // Tampilkan Error Khusus Paket
              <SectionError message={packagesError} onRetry={refetchPackages} />
            ) : packages.length === 0 ? (
              <View className="items-center justify-center py-6 bg-gray-50 rounded-2xl border border-gray-100">
                <Text className="text-gray-500 font-medium">Paket belum tersedia!</Text>
              </View>
            ) : (
              <View>
                <FlatList
                  ref={flatListRef}
                  data={packages}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  getItemLayout={(_, index) => ({
                    length: CARD_WIDTH,
                    offset: CARD_WIDTH * index,
                    index,
                  })}
                  onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
                    setCurrentIndex(newIndex);
                  }}
                  renderItem={({ item }) => (
                    <View style={{ width: CARD_WIDTH }}>
                      <HighlightPackageCard 
                        pkg={item}
                        onPress={() => navigation.navigate('ProductDetail', { productId: Number(item.id) })}
                      />
                    </View>
                  )}
                />
                <View className="flex-row justify-center items-center mt-3">
                  {packages.map((_, index) => (
                    <View 
                      key={index}
                      className={`h-2 rounded-full mx-1 ${
                        currentIndex === index ? 'w-6 bg-red-500' : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* --- SECTION 2: PABRIKAN TERLARIS --- */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-800">Pabrikan Terlaris</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Pabrikan')}>
                <Text className="text-sm font-bold text-red-500">Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            
            {statsLoading ? (
              <ActivityIndicator size="large" color="#EF4444" className="my-10" />
            ) : statsError ? (
              // Tampilkan Error Khusus Stats
              <SectionError message={statsError} onRetry={refetchStats} />
            ) : popularBrands.length === 0 ? (
              <View className="items-center justify-center py-6 bg-gray-50 rounded-2xl border border-gray-100">
                <Text className="text-gray-500 font-medium">Pabrikan belum tersedia!</Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap mb-2">
                {popularBrands.map((brand, index) => (
                  <View key={`brand-${brand.id || 'x'}-${index}`} className="w-1/4 items-center mb-4">
                    <TouchableOpacity 
                      className="items-center w-full"
                      onPress={() => {
                        navigation.navigate('FactoryProduct' as any, { 
                          brandId: brand.id, 
                          brandName: brand.name 
                        });
                      }}
                    >
                      <View className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 items-center justify-center mb-2 shadow-sm overflow-hidden">
                        <ImageWithFallback 
                          uri={brand.logo} 
                          className="w-10 h-10"
                          resizeMode="contain"
                          fallbackIcon="car-sport-outline"
                        />
                      </View>
                      <Text className="text-[10px] font-medium text-gray-700 text-center px-1" numberOfLines={1}>
                        {brand.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* --- SECTION 3: DIECAST POPULAR --- */}
          <View className="mb-2">
            <Text className="mb-3 text-lg font-bold text-gray-800">Diecast Popular</Text>
            {statsLoading ? (
              <ActivityIndicator size="large" color="#EF4444" className="my-10" />
            ) : statsError ? (
              // Gunakan komponen error yang sama
              <SectionError message={statsError} onRetry={refetchStats} />
            ) : topProducts.length === 0 ? (
              <View className="py-10 items-center bg-gray-50 rounded-2xl border border-gray-100">
                <Text className="text-gray-400">Produk belum tersedia</Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap -mx-2">
                {topProducts.map((item, index) => (
                  <BestSellerProductCard 
                    key={`product-${item.id || 'x'}-${index}`}
                    product={item}
                    onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                  />
                ))}
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}