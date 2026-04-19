import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageWithFallback from './ImageWithFallback';
import { formatRupiah } from '@/utils/formatters';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const isOutOfStock = Number(product.stock) === 0;

  return (
    <TouchableOpacity 
      className="w-1/2 p-2" 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <View className="relative h-40 bg-gray-50 items-center justify-center overflow-hidden">
          <ImageWithFallback 
            uri={product.photo} 
            className="w-full h-full"
            resizeMode="cover"
            fallbackIcon="cube-outline"
          />
          {isOutOfStock && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center z-10">
              <View className="bg-red-600 px-3 py-1.5 rounded-md shadow-lg">
                <Text className="text-white text-[11px] font-extrabold uppercase tracking-wider text-center">
                  Stok Habis
                </Text>
              </View>
            </View>
          )}
        </View>
        <View className="p-3 justify-between flex-1">
          <View>
            <Text className="text-sm text-gray-800 font-medium h-10" numberOfLines={2}>
              {product.name}
            </Text>
            <Text className="text-base font-bold text-red-500 mt-1">
              {formatRupiah(product.selling_price)}
            </Text>

            <View className="mt-2 self-start bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
              <Text className="text-[10px] text-gray-500 font-bold uppercase">
                {product.brand?.name || 'Pabrikan'}
              </Text>
            </View>
          </View>
          <View className="mt-3 pt-2 border-t border-gray-50">
             <Text className="text-[10px] text-gray-400">
               Stok: {product.stock} pcs
             </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}