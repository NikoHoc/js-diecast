import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageWithFallback from '@/components/ImageWithFallback';
import { formatRupiah } from '@/utils/formatters';
import { Package } from '@/types';

interface PackageCardProps {
  pkg: Package;
  onPress: () => void;
}

export default function PackageCard({ pkg, onPress }: PackageCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      className="bg-white mb-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      onPress={onPress}
    >
      {/* Gambar Full Width di atas */}
      <View className="w-full h-48 bg-gray-100">
        <ImageWithFallback 
          uri={pkg.image} 
          className="w-full h-full"
          resizeMode="cover"
          fallbackIcon="cube-outline"
        />
        
        {/* Badge Stok Menipis */}
        {Number(pkg.stock_available) > 0 && Number(pkg.stock_available) <= 3 && (
          <View className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">Sisa {pkg.stock_available}!</Text>
          </View>
        )}
      </View>
      
      {/* Deskripsi di bawah gambar */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
          {pkg.name}
        </Text>
        
        <View className="flex-row items-center justify-between mt-3">
          <View>
            <Text className="text-xs font-semibold text-gray-500 mb-1">Harga Paket</Text>
            <Text className="text-xl font-black text-red-500">
              {formatRupiah(Number(pkg.price))}
            </Text>
          </View>
          
          <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center">
            <Ionicons name="arrow-forward" size={20} color="#EF4444" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}