import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageWithFallback from '@/components/ImageWithFallback';
import { formatRupiah } from '@/utils/formatters';

interface GlobalProductCardProps {
  item: any;
  onPress: () => void;
}

export default function GlobalProductCard({ item, onPress }: GlobalProductCardProps) {
  // IDENTIFIKASI TIPE ITEM
  const isPackage = 'price' in item; 
  const isPO = !isPackage && (item.is_po === "1" || item.is_po === 1);
  
  // PENGECEKAN STOK HABIS (Khusus untuk Ready dan Paket)
  // PO biasanya sistem antrean, jadi diasumsikan tidak pernah 'Habis' stok fisik
  const currentStock = isPackage ? Number(item.stock_available || 0) : Number(item.stock || 0);
  const isOutOfStock = !isPO && currentStock <= 0;

  // LOGIKA LABEL & WARNA (KIRI ATAS)
  let labelText = '';
  let labelColor = '';
  if (isPackage) {
    labelText = 'PAKET';
    labelColor = 'bg-blue-500';
  } else if (isPO) {
    labelText = 'PO';
    labelColor = 'bg-amber-500'; 
  } else {
    labelText = 'READY';
    labelColor = 'bg-red-500'; 
  }

  // LOGIKA HARGA
  const renderPrice = () => {
    if (isPO) {
      const readyPrice = Number(item.ready_selling_price || item.selling_price || 0);
      const poPrice = Number(item.po_selling_price || item.selling_price || 0);
      return (
        <View>
          <Text className="text-[10px] text-gray-400 line-through">
            {formatRupiah(readyPrice)}
          </Text>
          <Text className="text-sm font-black text-red-500 leading-tight">
            {formatRupiah(poPrice)}
          </Text>
        </View>
      );
    }
    const activePrice = Number(isPackage ? item.price : item.selling_price);
    return (
      <Text className="text-sm font-black text-red-500">
        {formatRupiah(activePrice)}
      </Text>
    );
  };

  // LOGIKA STOK BAWAH
  const renderStock = () => {
    if (isPO) {
      const count = item.order_count || 0; 
      return <Text className="text-[10px] text-gray-500 font-medium">{count} Peserta</Text>;
    }
    return <Text className="text-[10px] text-gray-500 font-medium">Sisa {currentStock}</Text>;
  };

  const brandName = isPackage ? 'PAKET BUNDLING' : (item.brand_name || 'Tanpa Merk');

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      // Tambahkan efek sedikit memudar (opacity-70) jika habis
      className={`w-[48%] bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden ${isOutOfStock ? 'opacity-80' : ''}`}
    >
      <View className="w-full aspect-square bg-gray-100 relative">
        <ImageWithFallback 
          uri={item.image || item.photo} 
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Label Tipe Item */}
        <View className={`absolute top-2 left-2 px-2 py-1 rounded-md ${labelColor} z-10`}>
          <Text className="text-white text-[10px] font-bold tracking-wider">{labelText}</Text>
        </View>

        {/* OVERLAY HABIS */}
        {isOutOfStock && (
          <View className="absolute inset-0 bg-white/60 items-center justify-center z-20">
            <View className="bg-gray-800/90 px-3 py-1.5 rounded-full border border-gray-700">
              <Text className="text-white text-[10px] font-bold tracking-widest">HABIS</Text>
            </View>
          </View>
        )}
      </View>

      <View className="p-3">
        <Text className="text-[10px] text-gray-400 font-bold mb-1 uppercase" numberOfLines={1}>
          {brandName}
        </Text>
        <Text className="text-xs font-bold text-gray-800 mb-2 leading-tight h-8" numberOfLines={2}>
          {item.name}
        </Text>
        <View className="flex-row items-end justify-between mt-auto">
          <View className="flex-1 pr-1">
            {renderPrice()}
          </View>
          <View className="items-end">
            {renderStock()}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}