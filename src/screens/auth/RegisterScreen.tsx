import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { authService } from '@/services/auth';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState(''); 
  const [loading, setLoading] = useState(false);

  const isFormValid = name && phone && storeName;

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await authService.register({ name, phone, store_name: storeName });
      
      if (result.success) {
        Alert.alert('Berhasil', 'Kode OTP telah dikirim ke WhatsApp/SMS Anda.');
        navigation.navigate('VerifyOtp', { phone: phone });
      } else {
        Alert.alert('Registrasi Gagal', result.message || 'Terjadi kesalahan saat mendaftar.');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6" style={{ paddingTop: insets.top + 20, paddingBottom: 20 }}>
          <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.pop() : navigation.replace('Login')} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mb-6">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <View className="items-center mb-6">
            <Image 
              source={require('../../../assets/images/jsdiecast.jpg')} 
              style={{ width: 80, height: 80, borderRadius: 16 }}
              resizeMode="contain"
            />
          </View>

          <View className="mb-6 items-center">
            <Text className="text-3xl font-black text-gray-800 mb-2">Buat Akun Baru</Text>
            <Text className="text-base text-gray-500 text-center">
              Daftar dan nikmati keuntungan member JSDIECAST!
            </Text>
          </View>

          <View className="space-y-4 gap-4">
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-1.5 ml-1">Nama Lengkap *</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Ionicons name="person-outline" size={20} color="gray" />
                <TextInput placeholder="Masukkan nama lengkap" className="flex-1 ml-3 text-gray-800" value={name} onChangeText={setName} />
              </View>
            </View>
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-1.5 ml-1">Username *</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Ionicons name="storefront-outline" size={20} color="gray" />
                <TextInput placeholder="Masukkan username" className="flex-1 ml-3 text-gray-800" value={storeName} onChangeText={setStoreName} />
              </View>
            </View>
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-1.5 ml-1">Nomor Handphone (WA) *</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Ionicons name="call-outline" size={20} color="gray" />
                <TextInput placeholder="081234567890" className="flex-1 ml-3 text-gray-800" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
              </View>
            </View>
          </View>

          <View className="mt-8">
            <TouchableOpacity 
              className={`w-full py-4 rounded-xl items-center flex-row justify-center shadow-sm ${isFormValid && !loading ? 'bg-red-500' : 'bg-red-300'}`}
              disabled={!isFormValid || loading}
              onPress={handleRegister}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Daftar Sekarang</Text>}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500">Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.pop() : navigation.replace('Login')}>
                <Text className="font-bold text-red-500">Masuk di sini</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}