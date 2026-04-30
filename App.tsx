import './global.css';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync();

        await new Promise(resolve => setTimeout(resolve, 2500));
        
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <Image 
          source={require('./assets/images/jsdiecast.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>JSDIECAST.ID</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  splashText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 20,
    letterSpacing: 1.5,
  }
});