import React, { useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_600SemiBold_Italic,
} from '@expo-google-fonts/playfair-display';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AudioProvider } from './src/context/AudioContext';
import { AuthGateProvider } from './src/context/AuthGateContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_600SemiBold_Italic,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.papelAlgodon }} onLayout={onLayoutRootView}>
      <AuthGateProvider>
        <AudioProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </AudioProvider>
      </AuthGateProvider>
    </View>
  );
}
