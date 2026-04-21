import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { api } from '@/services/api';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = name && phone && password && (password === confirmPassword);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await api.post('/auth/register', { 
        name, 
        phone, 
        password 
      });
      
      if (result.success) {
        Alert.alert(
          'Registrasi Berhasil!', 
          'Akun kamu berhasil dibuat. Silakan login untuk melanjutkan.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
          ]
        );
      } else {
        Alert.alert('Registrasi Gagal', result.error || 'Terjadi kesalahan saat mendaftar.');
      }
    } catch (error) {
      Alert.alert('Error', 'Tidak dapat terhubung ke server. Periksa koneksi Anda.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6" style={{ paddingTop: insets.top + 20, paddingBottom: 20 }}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mb-6"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="mb-8">
            <Text className="text-3xl font-black text-gray-800 mb-2">Buat Akun Baru</Text>
            <Text className="text-base text-gray-500">
              Daftar sekarang untuk mulai mengoleksi diecast impianmu dan nikmati keuntungannya.
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
              <Text className="text-sm font-bold text-gray-700 mb-1.5 ml-1">Nomor Handphone *</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Ionicons name="call-outline" size={20} color="gray" />
                <TextInput placeholder="081234567890" className="flex-1 ml-3 text-gray-800" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
              </View>
            </View>
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-1.5 ml-1">Password *</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="gray" />
                <TextInput placeholder="Buat password" className="flex-1 ml-3 text-gray-800" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-1.5 ml-1">Konfirmasi Password *</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="gray" />
                <TextInput placeholder="Ulangi password" className="flex-1 ml-3 text-gray-800" secureTextEntry={!showPassword} value={confirmPassword} onChangeText={setConfirmPassword} />
              </View>
              {password !== confirmPassword && confirmPassword.length > 0 && (
                <Text className="text-xs text-red-500 ml-1 mt-1">Password tidak cocok!</Text>
              )}
            </View>

          </View>

          <View className="flex-1 mt-6" />

          <View className="mt-4">
            <TouchableOpacity 
              className={`w-full py-4 rounded-xl items-center flex-row justify-center shadow-sm ${isFormValid && !loading ? 'bg-red-500' : 'bg-red-300'}`}
              disabled={!isFormValid || loading}
              onPress={handleRegister}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Daftar Sekarang</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500">Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                <Text className="font-bold text-red-500">Masuk di sini</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}