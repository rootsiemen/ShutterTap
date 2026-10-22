// src/theme.ts — ShutterTap design tokens + themes (canonical values; see DESIGN.md).
//
// Dark-first "midnight violet" identity. Every screen must consume these
// tokens (via useAppTheme) instead of hardcoding colors, spacing, or type.
// Preserved legacy exports: palette, lightTheme, darkTheme, useTheme.

import { useColorScheme } from 'react-native';
import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------

export const brand = {
  primary: '#8B5CF6', // violet — primary brand / Bluetooth glow
  primaryBright: '#A78BFA', // highlights, scan core, active states on dark
  primaryDeep: '#6D28D9', // pressed states, gradients base
  primaryOnLight: '#7C3AED', // darker violet so contrast passes on light bg
  teal: '#14B8A6', // secondary accent (success-adjacent highlights)
  coral: '#F97316', // tertiary accent (recording, warm highlights)
} as const;

// ---------------------------------------------------------------------------
// Semantic colors
// ---------------------------------------------------------------------------

export interface SemanticColors {
  background: string;
  elevated: string;
  card: string;
  cardPressed: string;
  primary: string;
  primaryBright: string;
  primaryDeep: string;
  primarySoft: string;
  secondaryAccent: string;
  tertiaryAccent: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  divider: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  disabled: string;
  onDisabled: string;
  onBrand: string;
  overlay: string;
  scrim: string;
  cameraChrome: string;
  cameraControl: string;
  cameraMuted: string;
  cameraWell: string;
  scanRing: string;
  shadow: string;
}

export const darkColors: SemanticColors = {
  background: '#0B0B12',
  elevated: '#12121A',
  card: '#17171F',
  cardPressed: '#20202B',
  primary: brand.primary,
  primaryBright: brand.primaryBright,
  primaryDeep: brand.primaryDeep,
  primarySoft: 'rgba(139, 92, 246, 0.14)',
  secondaryAccent: brand.teal,
  tertiaryAccent: brand.coral,
  text: '#F5F3FC',
  textSecondary: '#B9B4CC',
  textMuted: '#807A96',
  border: '#2A2A36',
  divider: '#1D1D27',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  disabled: '#33333F',
  onDisabled: '#6E6A82',
  onBrand: '#FFFFFF',
  overlay: 'rgba(4, 4, 10, 0.72)',
  scrim: 'rgba(0, 0, 0, 0.55)',
  cameraChrome: '#000000',
  cameraControl: '#FFFFFF',
  cameraMuted: '#B9B4CC',
  cameraWell: '#17171F',
  scanRing: brand.primary,
  shadow: '#000000',
};

export const lightColors: SemanticColors = {
  background: '#F4F3F7',
  elevated: '#ECEAF1',
  card: '#FFFFFF',
  cardPressed: '#EDEBF4',
  primary: brand.primaryOnLight,
  primaryBright: brand.primary,
  primaryDeep: brand.primaryDeep,
  primarySoft: 'rgba(124, 58, 237, 0.10)',
  secondaryAccent: '#0D9488',
  tertiaryAccent: '#EA580C',
  text: '#16151D',
  textSecondary: '#5B566E',
  textMuted: '#8A849E',
  border: '#E2DFEB',
  divider: '#ECE9F3',
  success: '#047857',
  warning: '#B45309',
  error: '#B00020',
  info: '#1D4ED8',
  disabled: '#D9D6E1',
  onDisabled: '#8A849E',
  onBrand: '#FFFFFF',
  overlay: 'rgba(22, 20, 32, 0.55)',
  scrim: 'rgba(10, 8, 18, 0.35)',
  cameraChrome: '#000000',
  cameraControl: '#FFFFFF',
  cameraMuted: '#B9B4CC',
  cameraWell: '#17171F',
  scanRing: brand.primaryOnLight,
  shadow: '#1A1430',
};

// Legacy static palette (kept for backwards compatibility).
export const palette = {
  primary: brand.primary,
  secondary: brand.coral,
  tertiary: brand.teal,
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onBackground: '#000000',
  onSurface: '#000000',
};

// ---------------------------------------------------------------------------
// Navigation container themes (driven by the same tokens)
// ---------------------------------------------------------------------------

export const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.card,
    text: lightColors.text,
    border: lightColors.border,
    notification: lightColors.error,
  },
};

export const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkColors.primaryBright,
    background: darkColors.background,
    card: darkColors.elevated,
    text: darkColors.text,
    border: darkColors.border,
    notification: darkColors.error,
  },
};

// Legacy helper (kept; new code should use useAppTheme).
export const useTheme = () => ({ colors: palette });

// ---------------------------------------------------------------------------
// Spacing (4pt grid)
// ---------------------------------------------------------------------------

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  screen: 16, // default screen edge padding
  cardGap: 12, // gap between stacked cards
  galleryGap: 2, // tight grid gap (matches gallery reference)
} as const;

// ---------------------------------------------------------------------------
// Radii
// ---------------------------------------------------------------------------

export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Typography (system type: SF on iOS, Roboto on Android)
// ---------------------------------------------------------------------------

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '700' },
  screenTitle: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  sectionTitle: { fontSize: 17, lineHeight: 22, fontWeight: '700' },
  cardTitle: { fontSize: 16, lineHeight: 21, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  secondary: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  button: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  buttonSmall: { fontSize: 14, lineHeight: 19, fontWeight: '600' },
  tabLabel: { fontSize: 11, lineHeight: 14, fontWeight: '600' },
  status: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  numeric: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
} as const;

// ---------------------------------------------------------------------------
// Elevation / shadows
// ---------------------------------------------------------------------------

export const elevation = {
  card: {
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  floating: {
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

export const motion = {
  fast: 150,
  base: 220,
  slow: 350,
  scanPulse: 2200, // Bluetooth radar loop
  pressScale: 0.97, // subtle press feedback scale
} as const;

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

const HEX6 = /^#[0-9a-fA-F]{6}$/;
const ALPHA2 = /^[0-9a-fA-F]{2}$/;

/**
 * Append a 2-digit alpha suffix to a #RRGGBB token (`withAlpha('#8B5CF6',
 * '1A')` → `'#8B5CF61A'`). Falls back to the opaque token when either
 * argument is not hex — a future rgba() accent must never silently produce
 * an invalid color string. Covered by DesignSystem tests.
 */
export const withAlpha = (hex: string, alpha: string): string =>
  HEX6.test(hex) && ALPHA2.test(alpha) ? `${hex}${alpha}` : hex;

// ---------------------------------------------------------------------------
// Touch / layout constants
// ---------------------------------------------------------------------------

export const touchTargetMin = 44;
export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;

// ---------------------------------------------------------------------------
// Theme hook
// ---------------------------------------------------------------------------

export interface AppTheme {
  dark: boolean;
  colors: SemanticColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  elevation: typeof elevation;
  motion: typeof motion;
}

export const useAppTheme = (): AppTheme => {
  const scheme = useColorScheme();
  const dark = scheme !== 'light';
  return {
    dark,
    colors: dark ? darkColors : lightColors,
    spacing,
    radii,
    typography,
    elevation,
    motion,
  };
};
