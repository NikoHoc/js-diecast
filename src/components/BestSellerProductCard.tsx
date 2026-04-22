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
      onPress={onPress}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4"
      style={{ width: '100%' }}
    >
      <ImageWithFallback 
        uri={product.photo} 
        className="w-full h-40 bg-gray-50"
        resizeMode="cover"
      />
      
      <View className="p-3">
        <Text className="text-[10px] font-bold text-red-500 uppercase mb-1">
          {product.brand?.name || 'Pabrikan'}
        </Text>
        
        <Text className="text-sm font-medium text-gray-800 h-10" numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text className="text-base font-bold text-gray-900 mt-1">
          {formatRupiah(product.selling_price)}
        </Text>

        <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <Text className="text-[10px] text-gray-500 font-bold">
            {product.total_quantity || 0} Terjual
          </Text>
          <View className="bg-gray-100 px-2 py-0.5 rounded-md">
            <Text className="text-[9px] text-gray-600 font-medium">
              {product.total_transactions || 0} Transaksi
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}