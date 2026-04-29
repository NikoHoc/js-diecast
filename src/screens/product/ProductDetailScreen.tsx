import React, { useState } from 'react';
import {View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { useProductDetail } from '@/hooks/useProductDetail';
import { formatRupiah } from '@/utils/formatters';
import ImageWithFallback from '@/components/ImageWithFallback';
import LoginReminderModal from '@/components/LoginReminderModal';
import CartButton from '@/components/CartButton';
import ProductActionModal from '@/components/ProductActionModal';
import ToastNotification from '@/components/ToastNotification';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
  const [modalVisible, setModalVisible] = useState(false);
  const { productId } = route.params;

  const { product, loading } = useProductDetail(productId);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { addToCart } = useCart();
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'cart' | 'buy'>('cart');
  const [toastVisible, setToastVisible] = useState(false);

  const openActionModal = (type: 'cart' | 'buy') => {
    setActionType(type);
    setActionModalVisible(true);
  };

  const handleConfirmAction = (quantity: number) => {
    setActionModalVisible(false);

    if (actionType === 'cart') {
      addToCart(product, quantity); 
      setToastVisible(true); 
    } else {
      console.log('Navigasi ke Checkout dengan jumlah:', quantity);
    }
  };

  if (loading || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const images = [product.photo];
  const isOutOfStock = Number(product.stock) === 0;

  const isLoggedIn = false;

  const handleActionWithAuth = (actionName: string) => {
    if (!isLoggedIn) {
      setModalVisible(true);
    } else {
      console.log('Melakukan aksi:', actionName);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="border-b border-gray-100 bg-white">
        <View className="flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="black" />
          </TouchableOpacity>
          <View className="flex-row items-center space-x-4">
            <CartButton />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="mb-10" showsVerticalScrollIndicator={false}>
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}>
            {images.map((img, index) => (
              <View key={index} style={{ width }}>
                <ImageWithFallback 
                  uri={img} 
                  className="w-full h-full bg-white" 
                  resizeMode="contain" 
                />
              </View>
            ))}
          </ScrollView>

          {images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-2">
              {images.map((_, index) => (
                <View
                  key={index}
                  className={`h-1.5 rounded-full ${currentIndex === index ? 'w-6 bg-red-500' : 'w-2 bg-gray-300'}`}
                />
              ))}
            </View>
          )}
        </View>

        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800">{product.name}</Text>
          <Text className="mt-1 text-2xl font-extrabold text-red-500">
            {formatRupiah(product.selling_price)}
          </Text>

          {isOutOfStock ? (
            <View className="mt-4 flex-row items-center">
              <View className="flex-row items-center rounded-md px-3 py-1.5 bg-red-600">
                <Ionicons name="alert-circle" size={16} color="white" />
                <Text className="ml-2 text-xs font-bold uppercase tracking-wider text-white">
                  Stok Habis
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-row items-center mt-3 bg-gray-50 self-start px-3 py-1.5 rounded-full border border-gray-100">
              <Ionicons name="cube-outline" size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-600 font-medium text-sm">
                Stok Tersedia: <Text className="font-bold text-gray-800">{product.stock} pcs</Text>
              </Text>
            </View>
          )}
        </View>

        <View className="h-2 bg-gray-100" />

        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Ionicons name="business" size={24} color="#6B7280" />
            </View>
            <View className="ml-3">
              <Text className="text-base font-bold text-gray-800">
                {product.brand?.name || 'Pabrikan'}
              </Text>
              <Text className="text-xs uppercase tracking-tighter text-gray-400">
                Official Distributor
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="rounded-lg border border-red-500 px-4 py-1.5"
            onPress={() =>
              navigation.navigate('FactoryProduct', {
                brandId: product.brand?.id,
                brandName: product.brand?.name,
              })
            }>
            <Text className="text-sm font-bold text-red-500">Lihat lainnya</Text>
          </TouchableOpacity>
        </View>

        <View className="h-2 bg-gray-100" />

        <View className="p-4 pb-24">
          <Text className="mb-2 text-lg font-bold text-gray-800">Deskripsi Produk</Text>
          <Text className="text-sm leading-6 text-gray-600">
            {product.description ||
              `Diecast ${product.name} dengan detail tingkat tinggi. Cocok untuk koleksi maupun hadiah. Produk original dari ${product.brand?.name}.`}
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center space-x-3 border-t border-gray-100 bg-white p-5 gap-2">
        <TouchableOpacity 
          className={`flex-1 h-12 items-center justify-center rounded-xl border ${isOutOfStock ? 'border-gray-200 bg-gray-50' : 'border-red-500 bg-white'}`}
          disabled={isOutOfStock}
          onPress={() => openActionModal('buy')}
          // onPress={() => handleActionWithAuth('buy')}
        >
          <Text className={`font-bold ${isOutOfStock ? 'text-gray-300' : 'text-red-500'}`}>
            Beli Langsung
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 h-12 items-center justify-center rounded-xl ${isOutOfStock ? 'bg-gray-300' : 'bg-red-500'}`}
          disabled={isOutOfStock}
          onPress={() => openActionModal('cart')}>
          <Text className="font-bold text-white">+ Keranjang</Text>
        </TouchableOpacity>
      </View>

      <LoginReminderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLogin={() => {
          setModalVisible(false);
          navigation.navigate('Login' as never);
        }}
      />

      <ProductActionModal
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        product={product}
        actionType={actionType}
        onConfirm={handleConfirmAction}
      />

      <ToastNotification 
        visible={toastVisible}
        message="Berhasil ditambahkan ke keranjang"
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}
