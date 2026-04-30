import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { authService } from '@/services/auth';

type VerifyOtpRouteProp = RouteProp<RootStackParamList, 'VerifyOtp'>;

export default function VerifyOtpScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<VerifyOtpRouteProp>();

  const { phone } = route.params;

  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = otpCode.length === 6 && password && password === confirmPassword;

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await authService.verifyOtp({
        phone,
        otp_code: otpCode,
        password: password,
      });

      if (result.success && result.data) {
        navigation.navigate('SuccessRegister', {
          apiKey: result.data.api_key,
          customer: result.data.customer,
        });
      } else {
        Alert.alert('Verifikasi Gagal', result.message || 'Kode OTP salah.');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authService.requestOtp(phone);
      Alert.alert('Terkirim', `Kode OTP baru telah dikirim ke ${phone}`);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim ulang OTP.');
      console.error("Error verify token otp: ", error)
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6" style={{ paddingTop: insets.top + 20, paddingBottom: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-gray-50">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <View className="mb-6 items-center">
            <Image
              source={require('../../../assets/images/jsdiecast.jpg')}
              style={{ width: 80, height: 80, borderRadius: 16 }}
              resizeMode="contain"
            />
          </View>

          <View className="mb-6 items-center">
            <Text className="mb-2 text-3xl font-black text-gray-800">Verifikasi OTP</Text>
            <Text className="text-center text-base text-gray-500">
              Masukkan 6 digit kode OTP yang dikirim ke <Text className="font-bold">{phone}</Text>{' '}
              dan buat password baru.
            </Text>
          </View>

          <View className="gap-4 space-y-4">
            <View>
              <Text className="mb-1.5 ml-1 text-sm font-bold text-gray-700">Kode OTP *</Text>
              <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="gray" />
                <TextInput
                  placeholder="Masukkan 6 digit OTP"
                  className="ml-3 flex-1 font-bold tracking-widest text-gray-800"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otpCode}
                  onChangeText={setOtpCode}
                />
              </View>
              <TouchableOpacity onPress={handleResendOtp} className="mt-2 items-end">
                <Text className="text-sm font-bold text-red-500">Kirim Ulang OTP</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text className="mb-1.5 ml-1 text-sm font-bold text-gray-700">Password Baru *</Text>
              <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="gray" />
                <TextInput
                  placeholder="Buat password"
                  className="ml-3 flex-1 text-gray-800"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="mb-1.5 ml-1 text-sm font-bold text-gray-700">
                Konfirmasi Password *
              </Text>
              <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="gray" />
                <TextInput
                  placeholder="Ulangi password"
                  className="ml-3 flex-1 text-gray-800"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              {password !== confirmPassword && confirmPassword.length > 0 && (
                <Text className="ml-1 mt-1 text-xs text-red-500">Password tidak cocok!</Text>
              )}
            </View>
          </View>

          <View className="mt-8">
            <TouchableOpacity
              className={`w-full flex-row items-center justify-center rounded-xl py-4 shadow-sm ${isFormValid && !loading ? 'bg-red-500' : 'bg-red-300'}`}
              disabled={!isFormValid || loading}
              onPress={handleVerifyOtp}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-lg font-bold text-white">Verifikasi & Buat Akun</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
