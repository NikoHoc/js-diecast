import React from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import CartButton from '@/components/CartButton';
import { useMembership } from '@/hooks/useMembership';
import MembershipCard from '@/components/MembershipInfoCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 16;
const SIDE_PADDING = (width - CARD_WIDTH) / 2;

export default function MembershipScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { memberships, loading } = useMembership();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-bold text-gray-800">Membership</Text>
        <CartButton />
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Text className="mt-4 font-medium text-gray-400">Memuat info membership...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mt-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: SIDE_PADDING,
                gap: SPACING,
              }}
              snapToInterval={CARD_WIDTH + SPACING}
              snapToAlignment="center"
              decelerationRate="fast">
              {memberships.map((tier) => (
                <MembershipCard key={tier.id} data={tier} />
              ))}
            </ScrollView>
          </View>

          <View className="mt-10 px-10">
            <Text className="text-center text-xs leading-5 text-gray-400">
              *Syarat dan ketentuan berlaku!
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
