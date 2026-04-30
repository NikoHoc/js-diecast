import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Package } from '@/types';

interface HighlightPackageCardProps {
  pkg: Package;
  onPress: () => void;
}

export default function HighlightPackageCard({ pkg, onPress }: HighlightPackageCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      className="w-full h-48 rounded-2xl overflow-hidden shadow-sm"
      onPress={onPress}
    >
      {/* Gambar Latar */}
      <View className="absolute inset-0 bg-gray-200">
        <Image 
          // source={require('../../assets/images/tes-paket-bundling-1.jpg')}
          source={{ uri: 'https://rapidlogic.online/api/v1/image/package/b1dd642fc82d8bd6f3ae91b6e10ba007.jpg' }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* <ImageWithFallback 
          uri={pkg.image} 
          className="w-full h-full"
          resizeMode="cover"
          fallbackIcon="cube-outline"
        /> */}
      </View>
      
      {/* Overlay Gelap (Gradasi/Transparan) agar teks terbaca */}
      <View className="absolute inset-0 bg-black/30" />

      {/* Badge Stok Menipis */}
      {Number(pkg.stock_available) > 0 && Number(pkg.stock_available) <= 3 && (
        <View className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">Sisa {pkg.stock_available}!</Text>
        </View>
      )}

      {/* Info Paket (Bottom Overlay) */}
      <View className="absolute bottom-0 left-0 right-0 p-4">
        <Text className="text-red-300 text-xs font-bold tracking-wider mb-1 uppercase">
          Bundling Spesial
        </Text>
        <Text className="text-white text-xl font-black shadow-sm" numberOfLines={2}>
          {pkg.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}