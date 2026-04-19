import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginReminderModal({ visible, onClose, onLogin }: Props) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-white w-full rounded-2xl p-2 items-center shadow-xl">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4 mt-2">
            <Ionicons name="cart" size={32} color="#EF4444" />
          </View>
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Ups, Kamu Belum Login!
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            Kamu harus login terlebih dahulu untuk memasukkan barang ke keranjang atau melakukan transaksi.
          </Text>

          <View className="flex-row gap-2 mt-2">
            <TouchableOpacity 
              className="flex-1 py-3 items-center rounded-2xl bg-gray-200"
              onPress={onClose}
            >
              <Text className="text-gray-600 rounded font-bold">Kembali</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 py-3 rounded-2xl bg-red-500 items-center"
              onPress={onLogin}
            >
              <Text className="text-white font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>
  );
}