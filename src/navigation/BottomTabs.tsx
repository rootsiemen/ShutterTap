// src/navigation/BottomTabs.tsx — bottom-tab navigator (6 tabs preserved).
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import DeviceScreen from '../screens/DeviceScreen';
import GestureScreen from '../screens/GestureScreen';
import CameraScreen from '../screens/CameraScreen';
import GalleryScreen from '../screens/GalleryScreen';
import MediaButtonScreen from '../screens/MediaButtonScreen';
import { typography, useAppTheme } from '../theme';
import { AppIcon, IconName } from '../components/AppIcon';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, IconName> = {
  Home: 'home',
  Device: 'bluetooth',
  Gesture: 'gesture',
  Camera: 'camera',
  Gallery: 'gallery',
  Media: 'media',
};

const TabIcon = ({ route, color, size }: { route: string; color: string; size: number }) => (
  <AppIcon name={TAB_ICONS[route] ?? 'home'} size={size} color={color} />
);

export const AppNavigator = () => {
  const { colors, dark } = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: dark ? colors.primaryBright : colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: dark ? colors.elevated : colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: typography.tabLabel,
        tabBarIcon: ({ color, size }) => (
          <TabIcon route={route.name} color={color} size={size} />
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Device" component={DeviceScreen} />
      <Tab.Screen name="Gesture" component={GestureScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Media" component={MediaButtonScreen} />
    </Tab.Navigator>
  );
};
