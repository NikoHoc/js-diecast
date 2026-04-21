import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageWithFallback from './ImageWithFallback';
import { Product } from '@/types';
import { formatRupiah } from '@/utils/formatters';

const { height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  product: Product;
  actionType: 'cart' | 'buy';
  onConfirm: (quantity: number) => void;
}

export default function ProductActionModal({ visible, onClose, product, actionType, onConfirm }: Props) {
  const [quantity, setQuantity] = useState(1);
  const maxStock = Number(product.stock);
  
  const slideAnim = useRef(new Animated.Value(height)).current; 
  const bgOpacity = useRef(new Animated.Value(0)).current;      

  useEffect(() => {
    if (visible) {
      setQuantity(1);
      slideAnim.setValue(height);
      bgOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(bgOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400, 
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleCloseModal = () => {
    Animated.parallel([
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleMinus = () => { if (quantity > 1) setQuantity(quantity - 1); };
  const handlePlus = () => { if (quantity < maxStock) setQuantity(quantity + 1); };

  return (
    <Modal transparent visible={visible} onRequestClose={handleCloseModal} animationType="none">
      <View className="flex-1 justify-end">
        <Animated.View style={[styles.overlay, { opacity: bgOpacity }]}>
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={handleCloseModal} />
        </Animated.View>

        <Animated.View 
          style={{ transform: [{ translateY: slideAnim }] }}
          className="bg-white rounded-t-3xl pt-2 pb-8 px-4 shadow-xl"
        >
          <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

          <View className="flex-row items-center border-b border-gray-100 pb-4 mb-4">
            <ImageWithFallback uri={product.photo} className="w-16 h-16 rounded-lg bg-gray-100" resizeMode="cover" />
            
            <View className="flex-1 ml-3 mr-2">
              <Text className="font-bold text-gray-800 text-sm" numberOfLines={2}>{product.name}</Text>
              <Text className="text-red-500 font-bold mt-0.5">{formatRupiah(product.selling_price)}</Text>
              <Text className="text-xs text-gray-400 mt-1">Sisa: {maxStock} pcs</Text>
            </View>

            <View className="flex-row items-center border border-gray-200 rounded-lg bg-white">
              <TouchableOpacity onPress={handleMinus} className="px-3 py-1.5 border-r border-gray-200" disabled={quantity <= 1}>
                <Ionicons name="remove" size={16} color={quantity <= 1 ? "#D1D5DB" : "#374151"} />
              </TouchableOpacity>
              <Text className="px-3 font-bold text-gray-800 min-w-[30px] text-center">{quantity}</Text>
              <TouchableOpacity onPress={handlePlus} className="px-3 py-1.5 border-l border-gray-200" disabled={quantity >= maxStock}>
                <Ionicons name="add" size={16} color={quantity >= maxStock ? "#D1D5DB" : "#EF4444"} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            className="w-full bg-red-500 py-4 rounded-xl items-center shadow-sm"
            onPress={() => onConfirm(quantity)}
          >
            <Text className="text-white font-bold text-base">
              {actionType === 'cart' ? '+ Masukkan Keranjang' : 'Lanjut ke Pembayaran'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
});