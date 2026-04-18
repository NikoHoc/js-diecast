import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import HomeHeader from '@/components/HomeHeader';
import { useBrands } from '@/hooks/useBrands';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function HomeScreen() {
    const navigation = useNavigation<BottomTabNavigationProp<any>>();

  const { brands, loading } = useBrands();
  const popularBrands = brands.slice(0, 4);

  return (
    <View className="flex-1 bg-white">
      <HomeHeader />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Promo Bundling</Text>
          <View className="h-48 bg-gray-100 rounded-2xl items-center justify-center border-dashed border-2 border-gray-300 mb-6">
            <Text className="text-gray-400 font-medium">Paket bundling belum tersedia!</Text>
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
              <View className="flex-row justify-between mb-6">
                {popularBrands.map((brand) => (
                  <TouchableOpacity 
                    key={brand.id} 
                    className="items-center w-16"
                    onPress={() => {
                      navigation.navigate('BrandProduct', { 
                        brandId: brand.id, 
                        brandName: brand.name 
                      });
                    }}
                  >
                    <View className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 items-center justify-center mb-2 shadow-sm overflow-hidden">
                      <ImageWithFallback 
                        uri={brand.logo} 
                        className="w-full h-full"
                        resizeMode="contain"
                        fallbackIcon="car-sport-outline"
                      />
                    </View>
                    <Text 
                      className="text-xs font-medium text-gray-700 text-center"
                      numberOfLines={1}
                    >
                      {brand.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}

          <Text className="text-lg font-bold text-gray-800 mb-3">Diecast Popular</Text>
          <View className="h-48 bg-gray-100 rounded-2xl items-center justify-center border-dashed border-2 border-gray-300">
            <Text className="text-gray-400 font-medium">Card Produk Akan Muncul Di Sini</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}