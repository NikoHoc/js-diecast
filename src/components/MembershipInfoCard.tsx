import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MembershipTier } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; 

export default function MembershipInfoCard({ data }: { data: MembershipTier }) {
  return (
    <View 
      style={{ 
        width: CARD_WIDTH, 
        backgroundColor: data.bgColor, 
        borderColor: data.borderColor,
        borderWidth: 1.5 
      }}
      className="p-5 rounded-3xl"
    >
      <View className="items-center mb-5">
        <View className="w-14 h-14 rounded-full bg-white items-center justify-center shadow-sm mb-2">
          <Ionicons name={data.icon as any} size={28} color={data.iconColor} />
        </View>
        <Text className="text-xl font-extrabold text-gray-800">{data.name}</Text>
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">{data.level}</Text>
      </View>

      <View className="space-y-3">
        <View>
          <Text className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Pengali Poin</Text>
          <Text className="font-bold text-gray-800 text-base">{data.multiplier}</Text>
        </View>
        <View>
          <Text className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Syarat Transaksi</Text>
          <Text className="font-bold text-gray-800 text-base">{data.minTransaction}</Text>
        </View>
        <View>
          <Text className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">DP Pre-Order (PO)</Text>
          <Text className="font-bold text-gray-800 text-base">{data.dpRule}</Text>
        </View>
      </View>

      {data.description ? (
        <View 
          className="mt-4 pt-4 border-t" 
          style={{ borderColor: data.borderColor }}
        >
          <Text className="text-xs text-gray-600 text-center leading-5">
            {data.description}
          </Text>
        </View>
      ) : null}
    </View>
  );
}