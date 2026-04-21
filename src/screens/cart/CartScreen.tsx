import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart, CartItem } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatRupiah } from '@/utils/formatters';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';

export default function CartScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { items, updateQuantity, removeFromCart, toggleCheck, toggleBrandCheck } = useCart();
  const { user } = useAuth();

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      const brandName = item.product.brand?.name || 'Lainnya';
      if (!acc[brandName]) acc[brandName] = [];
      acc[brandName].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  }, [items]);

  const checkedItems = items.filter(item => item.checked);
  const totalPrice = checkedItems.reduce((sum, item) => sum + (item.product.selling_price * item.quantity), 0);

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView edges={['top']} className="bg-white border-b border-gray-100">
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold ml-4 text-gray-800">Keranjang</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1">
        <View className="bg-white p-4 flex-row items-center border-b border-gray-100">
          <Ionicons name="location" size={20} color="#EF4444" />
          <View className="ml-3 flex-1">
            <Text className="text-gray-800 text-sm" numberOfLines={1}>
              {user?.address || "Alamat masih kosong, silakan tambahkan alamat dahulu."}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile' as any)}>
            <Text className="text-xs text-red-500 font-bold">Ubah</Text>
          </TouchableOpacity>
        </View>

        {items.length > 0 ? (
          Object.keys(groupedItems).map((brand) => {
            const brandProducts = groupedItems[brand];
            const isAllBrandChecked = brandProducts.every(p => p.checked);

            return (
              <View key={brand} className="bg-white mt-2 border-y border-gray-100">
                <View className="flex-row items-center px-4 py-3 border-b border-gray-50">
                  <TouchableOpacity onPress={() => toggleBrandCheck(brand, !isAllBrandChecked)}>
                    <Ionicons 
                      name={isAllBrandChecked ? "checkbox" : "square-outline"} 
                      size={22} color={isAllBrandChecked ? "#EF4444" : "#D1D5DB"} 
                    />
                  </TouchableOpacity>
                  <Text className="ml-3 font-bold text-gray-800">{brand}</Text>
                </View>

                {brandProducts.map((item) => (
                  <View key={item.product.id} className="flex-row p-4 items-center border-b border-gray-50">
                    <TouchableOpacity onPress={() => toggleCheck(item.product.id)}>
                      <Ionicons 
                        name={item.checked ? "checkbox" : "square-outline"} 
                        size={22} color={item.checked ? "#EF4444" : "#D1D5DB"} 
                      />
                    </TouchableOpacity>
                    
                    <ImageWithFallback uri={item.product.photo} className="w-20 h-20 rounded-xl ml-3 bg-gray-100" />
                    
                    <View className="flex-1 ml-4">
                      <Text className="text-sm font-medium text-gray-800" numberOfLines={2}>{item.product.name}</Text>
                      <Text className="text-red-500 font-bold mt-1">{formatRupiah(item.product.selling_price)}</Text>
                      
                      <Text className="text-[10px] text-gray-400 mt-1">Sisa Stok: {item.product.stock}</Text>
                      
                      <View className="flex-row items-center justify-end mt-2 space-x-3">
                        <TouchableOpacity 
                          onPress={() => removeFromCart(item.product.id)}
                          className="p-1"
                        >
                          <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        
                        <View className="flex-row items-center border border-gray-200 rounded-lg bg-white">
                          <TouchableOpacity 
                            onPress={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} 
                            className="px-3 py-1"
                          >
                            <Text className="text-gray-400 text-lg">-</Text>
                          </TouchableOpacity>
                          <Text className="px-2 font-bold text-gray-800">{item.quantity}</Text>
                          <TouchableOpacity 
                            onPress={() => updateQuantity(item.product.id, Math.min(Number(item.product.stock), item.quantity + 1))} 
                            className="px-3 py-1"
                          >
                            <Text className="text-red-500 text-lg">+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          })
        ) : (
          <View className="items-center justify-center py-20 px-10">
            <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-center">Wah, keranjang belanjamu kosong!</Text>
            <TouchableOpacity 
              className="mt-6 bg-red-500 px-8 py-3 rounded-xl"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white font-bold">Cari Produk</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View className="bg-white p-4 pb-8 border-t border-gray-100 flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-gray-500">Total Harga</Text>
          <Text className="text-red-500 font-bold text-lg">{formatRupiah(totalPrice)}</Text>
        </View>
        <TouchableOpacity 
          className={`px-8 py-3 rounded-xl ${checkedItems.length > 0 ? 'bg-red-500' : 'bg-gray-300'}`}
          disabled={checkedItems.length === 0}
        >
          <Text className="text-white font-bold">Beli ({checkedItems.length})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}