import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions, FlatList } from 'react-native';
import HomeHeader from '@/components/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useHomeStats } from '@/hooks/useStats';
import BestSellerProductCard from '@/components/BestSellerProductCard';
import { usePackages } from '@/hooks/usePackages';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();

  const { packages, loading: loadingPackage } = usePackages();
  const { topBrands, topProducts, loading } = useHomeStats();

  const popularBrands = topBrands.slice(0, 8);

  const comingSoonImage = require('../../../assets/images/coming-soon.jpg');

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <HomeHeader />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="mb-3 text-lg font-bold text-gray-800">Paket Bundling</Text>
          <View className="mb-6 h-48 rounded-2xl overflow-hidden bg-gray-100 border-2 border-red-400">
            {loadingPackage ? (
              <ActivityIndicator color="#EF4444" />
            ) : packages.length > 0 ? (
              <FlatList 
                data={packages}
                horizontal
                pagingEnabled
                renderItem={({ item }) => (
                  <Image source={{ uri: item.photo }} style={{ width: width - 32, height: 160 }} />
                )}
              />
            ) : (
              <Image 
                source={comingSoonImage} 
                style={{ width: width - 32, height: 160 }}
                resizeMode="cover"
              />
            )}
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">Pabrikan Terlaris</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Pabrikan')}>
              <Text className="text-sm font-bold text-red-500">Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#EF4444" className="my-4" />
          ) : (
            popularBrands.length === 0 ? (
              <View className="items-center justify-center py-6 mb-6 bg-gray-50 rounded-2xl border border-gray-100">
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
            )
          )}

          <Text className="mb-2 text-lg font-bold text-gray-800">Diecast Popular</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#EF4444" className="my-10" />
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
      </ScrollView>
    </View>
  );
}