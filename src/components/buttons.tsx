// src/components/buttons.tsx — Button, IconButton, ShutterButton.
// One button implementation for the whole app; no per-screen duplicates.

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { hitSlop, radii, spacing, typography, useAppTheme } from '../theme';
import { AppIcon, IconName } from './AppIcon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  accessibilityHint,
}: ButtonProps) => {
  const { colors, dark } = useAppTheme();
  const inactive = disabled || loading;
  const small = size === 'sm';

  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.card
        : variant === 'danger'
          ? colors.error
          : 'transparent';

  const fg =
    variant === 'primary'
      ? colors.onBrand
      : variant === 'secondary'
        ? colors.text
        : variant === 'danger'
          ? colors.onBrand
          : dark
            ? colors.primaryBright
            : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        small ? styles.small : styles.medium,
        {
          backgroundColor: inactive ? colors.disabled : bg,
          borderColor:
            variant === 'secondary' ? colors.border : 'transparent',
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: pressed && !inactive ? 0.88 : 1,
          transform: [{ scale: pressed && !inactive ? 0.97 : 1 }],
          ...(fullWidth ? { alignSelf: 'stretch' } : {}),
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' ? fg : colors.onBrand}
        />
      ) : (
        <>
          {icon ? (
            <AppIcon
              name={icon}
              size={small ? 18 : 20}
              color={inactive ? colors.onDisabled : fg}
            />
          ) : null}
          <Text
            style={[
              small ? typography.buttonSmall : typography.button,
              { color: inactive ? colors.onDisabled : fg },
            ]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

// ---------------------------------------------------------------------------
// IconButton — 44pt touch target for camera chrome + headers.
// ---------------------------------------------------------------------------

export const IconButton = ({
  icon,
  onPress,
  label,
  size = 44,
  variant = 'ghost',
  color,
  disabled = false,
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
  size?: number;
  variant?: 'ghost' | 'filled' | 'chrome';
  color?: string;
  disabled?: boolean;
}) => {
  const { colors } = useAppTheme();
  const bg =
    variant === 'filled'
      ? colors.card
      : variant === 'chrome'
        ? 'rgba(0, 0, 0, 0.45)'
        : 'transparent';
  const fg =
    color ?? (variant === 'chrome' ? colors.cameraControl : colors.text);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed && !disabled ? 0.7 : disabled ? 0.4 : 1,
          transform: [{ scale: pressed && !disabled ? 0.94 : 1 }],
        },
      ]}>
      <AppIcon name={icon} size={size * 0.5} color={fg} />
    </Pressable>
  );
};

// ---------------------------------------------------------------------------
// ShutterButton — prominent camera capture control (reference 3).
// ---------------------------------------------------------------------------

export const ShutterButton = ({
  onPress,
  label = 'Take photo',
  recording = false,
  disabled = false,
}: {
  onPress: () => void;
  label?: string;
  recording?: boolean;
  disabled?: boolean;
}) => {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        styles.shutterOuter,
        {
          borderColor: colors.cameraControl,
          opacity: disabled ? 0.4 : 1,
          transform: [{ scale: pressed && !disabled ? 0.92 : 1 }],
        },
      ]}>
      <View
        style={[
          styles.shutterInner,
          {
            backgroundColor: recording ? colors.error : colors.cameraControl,
            borderRadius: recording ? 8 : 9999,
          },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xxl,
    gap: spacing.sm,
  },
  medium: { minHeight: 50, paddingHorizontal: spacing.xl },
  small: { minHeight: 40, paddingHorizontal: spacing.lg },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: 58, height: 58 },
});
