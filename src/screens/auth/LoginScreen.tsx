import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext'; 
import { api } from '@/services/api';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await api.post('/auth/login', { phone, password });
      
      if (result.success) {
        await login(
          result.data.customer, 
          result.data.tokens.access_token, 
          result.data.tokens.refresh_token
        );
        
        navigation.goBack(); 
      } else {
        Alert.alert('Login Gagal', result.error || 'Nomor HP atau password salah.');
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
            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mb-8"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <View className="mb-10">
            <Text className="text-3xl font-black text-gray-800 mb-2">Selamat Datang!</Text>
            <Text className="text-base text-gray-500">
              Login untuk mengelola keranjang, melihat riwayat, dan menukar poin member kamu.
            </Text>
          </View>

          <View className="space-y-5">
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Nomor Handphone</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Ionicons name="call-outline" size={20} color="gray" />
                <TextInput
                  placeholder="081234567890"
                  className="flex-1 ml-3 text-gray-800"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Password</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="gray" />
                <TextInput
                  placeholder="Masukkan password"
                  className="flex-1 ml-3 text-gray-800"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-1" />

          <View className="mt-8">
            <TouchableOpacity 
              className={`w-full py-4 rounded-xl items-center flex-row justify-center shadow-sm ${phone && password && !loading ? 'bg-red-500' : 'bg-red-300'}`}
              disabled={!phone || !password || loading}
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Login</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500">Belum punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                <Text className="font-bold text-red-500">Daftar Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}