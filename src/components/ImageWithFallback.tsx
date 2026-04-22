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
  const defaultImage = require('../../assets/images/coming-soon.jpg');
  const [hasError, setHasError] = useState(false);

  const isNoImage = !uri || hasError || uri.includes('noimage.jpg');

  if (isNoImage) {
    return (
      <Image 
        source={defaultImage}
        className={className}
        {...props} 
      />
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