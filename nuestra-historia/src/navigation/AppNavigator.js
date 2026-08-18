import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuthGate } from '../context/AuthGateContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

import LockScreen from '../screens/LockScreen';
import GalleryScreen from '../screens/GalleryScreen';
import MusicScreen from '../screens/MusicScreen';
import MomentsScreen from '../screens/MomentsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PhotoViewerScreen from '../screens/PhotoViewerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Galería: 'images',
  Canciones: 'musical-notes',
  Momentos: 'heart',
  Ajustes: 'settings',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.rosaNube,
        tabBarInactiveTintColor: colors.humoLila,
        tabBarStyle: { backgroundColor: colors.papelAlgodon, borderTopColor: colors.humoLila + '55' },
        tabBarLabelStyle: { fontFamily: fonts.bodySemi, fontSize: 11 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Galería" component={GalleryScreen} />
      <Tab.Screen name="Canciones" component={MusicScreen} />
      <Tab.Screen name="Momentos" component={MomentsScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { unlocked } = useAuthGate();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!unlocked ? (
        <Stack.Screen name="Lock" component={LockScreen} />
      ) : (
        <>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen
            name="PhotoViewer"
            component={PhotoViewerScreen}
            options={{ presentation: 'fullScreenModal', animation: 'fade' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
