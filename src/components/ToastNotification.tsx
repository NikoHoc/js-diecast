import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  message: string;
  onHide: () => void;
}

export default function ToastNotification({ visible, message, onHide }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShow(false);
            onHide();
          });
        }, 2000);
      });
    }
  }, [visible, opacity, onHide]);

  if (!show) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <View className="bg-gray-800/90 flex-row items-center px-4 py-3 rounded-full shadow-lg">
        <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
        <Text className="text-white font-medium ml-2 text-sm">{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 50,
  }
});