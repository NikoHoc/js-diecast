import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import LoginReminderModal from './LoginReminderModal';

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
  
  const isLoggedIn = false; 

  const handlePress = () => {
    if (!isLoggedIn) {
      setModalVisible(true);
    } else {
      console.log('Navigasi ke Halaman Cart');
      // navigation.navigate('CartScreen'); 
    }
  };

  return (
    <>
      <TouchableOpacity className={containerClassName} onPress={handlePress}>
        <Ionicons name={iconName} size={size} color={iconColor} />
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