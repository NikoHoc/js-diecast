import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageWithFallback from './ImageWithFallback';
import { formatRupiah } from '@/utils/formatters';

interface Props {
  product: any;
  onPress: () => void;
}

export default function BestSellerProductCard({ product, onPress }: Props) {
  return (
    <TouchableOpacity 
      className="w-1/2 p-2" 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex-1">
        <View className="relative h-40 bg-gray-50 items-center justify-center overflow-hidden">
          <ImageWithFallback 
            uri={product.photo} 
            className="w-full h-full"
            resizeMode="cover"
            fallbackIcon="cube-outline"
          />
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
          <View className="mt-3 pt-2 border-t border-gray-50 flex-row items-center justify-between">
            <Text className="text-[10px] text-gray-500 font-bold">
              {product.total_quantity || 0} Terjual
            </Text>
            <View className="bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              <Text className="text-[9px] text-red-600 font-bold">
                {product.total_transactions || 0} Transaksi
              </Text>
            </View>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}