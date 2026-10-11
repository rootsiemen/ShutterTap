// src/theme.ts
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

// Premium crayon‑like palette (from the original app)
export const palette = {
  primary: '#8B5CF6', // purple
  secondary: '#F97316', // coral
  tertiary: '#14B8A6', // teal
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onBackground: '#000000',
  onSurface: '#000000',
};

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...palette,
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...palette,
  },
};

export const useTheme = () => ({ colors: palette }); // simple helper for static colors
