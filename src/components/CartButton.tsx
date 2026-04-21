import React, { useState } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import LoginReminderModal from './LoginReminderModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface CartButtonProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  size?: number;
  containerClassName?: string;
}

export default function CartButton({ 
  iconName = "cart-outline", 
  iconColor = "black", 
  size = 26, 
  containerClassName = "p-2"
}: CartButtonProps) {
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  
  const { totalItems } = useCart(); 
  const { isLoggedIn } = useAuth(); 

  const handlePress = () => {
    if (!isLoggedIn) {
      setModalVisible(true);
    } else {
      console.log('Navigasi ke Halaman Cart');
      navigation.navigate('Cart'); 
    }
  };

  return (
    <>
      <TouchableOpacity className={containerClassName} onPress={handlePress}>
        <View>
          <Ionicons name={iconName} size={size} color={iconColor} />
          {totalItems > 0 && (
            <View 
              className="absolute -top-1.5 -right-2 bg-red-500 rounded-full h-4 min-w-[16px] px-1 items-center justify-center"
              style={{ zIndex: 1 }}
            >
              <Text className="text-[10px] font-bold text-white leading-none">
                {totalItems > 99 ? '99+' : totalItems}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <LoginReminderModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLogin={() => {
          setModalVisible(false);
          navigation.navigate('Login' as any); 
        }}
      />
    </>
  );
}