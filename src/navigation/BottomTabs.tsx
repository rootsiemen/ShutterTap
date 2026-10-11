// src/navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import DeviceScreen from '../screens/DeviceScreen';
import GestureScreen from '../screens/GestureScreen';
import CameraScreen from '../screens/CameraScreen';
import GalleryScreen from '../screens/GalleryScreen';
import MediaButtonScreen from '../screens/MediaButtonScreen';
import { useTheme } from '../theme';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: useTheme().colors.surface },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Device" component={DeviceScreen} />
    <Tab.Screen name="Gesture" component={GestureScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
    <Tab.Screen name="Gallery" component={GalleryScreen} />
    <Tab.Screen name="Media" component={MediaButtonScreen} />
  </Tab.Navigator>
);
