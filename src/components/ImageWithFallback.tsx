import React, { useState } from 'react';
import { Image, View, ImageProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageWithFallbackProps extends Omit<ImageProps, 'source'> {
  uri: string | null | undefined;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
}

export default function ImageWithFallback({ 
  uri, 
  fallbackIcon = 'image-outline', 
  className, 
  ...props 
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const isNoImage = !uri || hasError || uri.includes('noimage.jpg');

  if (isNoImage) {
    return (
      <View className={`items-center justify-center bg-gray-100 ${className}`}>
        <Ionicons name={fallbackIcon} size={28} color="#9CA3AF" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      className={className}
      onError={() => {   
        console.log(`Gambar gagal dimuat: ${uri}`);
        setHasError(true);
      }}
      {...props}
    />
  );
}