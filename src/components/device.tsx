// src/components/device.tsx — Bluetooth discovery + connection visuals.
// ScanRadar is driven by the REAL `scanning` flag; it never animates
// a fake scan. ConnectingOverlay reflects the REAL `connecting` state.

import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { radii, spacing, typography, useAppTheme, withAlpha } from '../theme';
import { BluetoothDevice } from '../types/models';
import { AppIcon } from './AppIcon';
import { Button } from './buttons';
import { Card, StatusBadge } from './ui';

// ---------------------------------------------------------------------------
// ScanRadar — concentric discovery visual (reference 1).
// ---------------------------------------------------------------------------

export const ScanRadar = ({
  scanning,
  size = 220,
}: {
  scanning: boolean;
  size?: number;
}) => {
  const { colors, dark, motion } = useAppTheme();
  const pulse = useRef(new Animated.Value(0)).current;
  const reduceMotion = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(v => {
      reduceMotion.current = v ?? false;
    });
  }, []);

  useEffect(() => {
    if (!scanning || reduceMotion.current) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: motion.scanPulse,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [scanning, pulse, motion.scanPulse]);

  const glow = colors.scanRing;
  const rings = [0.62, 0.82, 1];

  return (
    <View
      accessible
      accessibilityLabel={scanning ? 'Scanning for devices' : 'Not scanning'}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {rings.map((r, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: size * r,
            height: size * r,
            borderRadius: (size * r) / 2,
            backgroundColor:
              i === rings.length - 1
                ? colors.primarySoft
                : scanning
                  ? withAlpha(glow, i === 0 ? '2E' : '1A')
                  : colors.elevated,
          }}
        />
      ))}
      {scanning
        ? [0, 1].map(i => {
            const scale = pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.45, 1.05],
            });
            const opacity = pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.55, 0],
            });
            return (
              <Animated.View
                key={`p-${i}`}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: 2,
                  borderColor: glow,
                  opacity,
                  transform: [
                    { scale },
                    { rotate: i === 1 ? '180deg' : '0deg' },
                  ],
                }}
              />
            );
          })
        : null}
      <View
        style={[
          styles.core,
          {
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: size * 0.2,
            backgroundColor: scanning
              ? colors.primary
              : dark
                ? colors.elevated
                : colors.card,
            borderColor: colors.border,
          },
        ]}>
        <AppIcon
          name="bluetooth"
          size={size * 0.2}
          color={scanning ? colors.onBrand : colors.textMuted}
        />
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// DeviceCard — one discovered device; only real data, no placeholders.
// ---------------------------------------------------------------------------

const rssiLevel = (rssi?: number) => {
  if (rssi == null) {
    return 0;
  }
  if (rssi >= -60) {
    return 4;
  }
  if (rssi >= -70) {
    return 3;
  }
  if (rssi >= -80) {
    return 2;
  }
  return 1;
};

export const DeviceCard = ({
  device,
  connected,
  connecting,
  onConnect,
}: {
  device: BluetoothDevice;
  connected: boolean;
  connecting: boolean;
  onConnect: () => void;
}) => {
  const { colors, dark } = useAppTheme();
  return (
    <Card style={styles.deviceCard}>
      <View
        style={[
          styles.deviceAvatar,
          { backgroundColor: colors.primarySoft },
        ]}>
        <AppIcon
          name="headphones"
          size={26}
          color={dark ? colors.primaryBright : colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[typography.bodyStrong, { color: colors.text }]}
          numberOfLines={1}>
          {device.name || 'Unknown device'}
        </Text>
        <Text
          style={[typography.numeric, { color: colors.textMuted }]}
          numberOfLines={1}>
          {device.address}
        </Text>
        <View style={styles.deviceMeta}>
          <AppIcon
            name="signal"
            size={16}
            color={colors.textSecondary}
            level={rssiLevel(device.rssi)}
          />
          {device.rssi != null ? (
            <Text
              style={[typography.numeric, { color: colors.textSecondary }]}>
              {device.rssi} dBm
            </Text>
          ) : null}
          {device.paired ? (
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              · Paired
            </Text>
          ) : null}
        </View>
      </View>
      {connected ? (
        <StatusBadge tone="success" label="Connected" />
      ) : (
        <Button
          title="Connect"
          size="sm"
          onPress={onConnect}
          disabled={connecting}
          loading={connecting}
        />
      )}
    </Card>
  );
};

// ---------------------------------------------------------------------------
// ConnectingOverlay — connection progress (reference 2).
// ---------------------------------------------------------------------------

export const ConnectingOverlay = ({
  visible,
  deviceName,
  error,
  onCancel,
  onRetry,
}: {
  visible: boolean;
  deviceName?: string;
  error?: string;
  onCancel: () => void;
  onRetry?: () => void;
}) => {
  const { colors } = useAppTheme();
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // No loop while hidden; none needed for the static error variant.
    if (!visible || error) {
      return;
    }
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [visible, error, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          accessible
          accessibilityRole="alert"
          accessibilityLabel={
            error
              ? `Connection failed: ${error}`
              : `Connecting to ${deviceName ?? 'device'}`
          }
          style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={{ alignItems: 'center' }}>
            {error ? (
              <AppIcon name="alert" size={44} color={colors.error} />
            ) : (
              <View
                style={{
                  width: 96,
                  height: 96,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Animated.View
                  style={{
                    position: 'absolute',
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    borderWidth: 2,
                    borderColor: colors.primary,
                    borderTopColor: 'transparent',
                    transform: [{ rotate }],
                  }}
                />
                <AppIcon
                  name="headphones"
                  size={44}
                  color={colors.textSecondary}
                />
              </View>
            )}
          </View>
          <Text
            style={[
              typography.sectionTitle,
              { color: colors.text, textAlign: 'center' },
            ]}>
            {error ? 'Connection failed' : 'Connecting…'}
          </Text>
          <Text
            style={[
              typography.secondary,
              { color: colors.textSecondary, textAlign: 'center' },
            ]}>
            {error ??
              `Please wait while we establish a connection${
                deviceName ? ` to ${deviceName}` : ''
              }.`}
          </Text>
          <View style={styles.sheetActions}>
            {error && onRetry ? (
              <Button title="Retry" onPress={onRetry} fullWidth />
            ) : null}
            <TouchableOpacity
              onPress={onCancel}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={
                error ? 'Dismiss' : 'Cancel connection attempt'
              }>
              <Text
                style={[
                  typography.button,
                  {
                    color: colors.textSecondary,
                    textAlign: 'center',
                    paddingVertical: spacing.sm,
                  },
                ]}>
                {error ? 'Dismiss' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  core: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.cardGap,
  },
  deviceAvatar: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 6,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  sheet: {
    width: '100%',
    borderRadius: radii.xl,
    padding: spacing.xxl,
    gap: spacing.md,
  },
  sheetActions: { marginTop: spacing.sm, gap: spacing.sm },
});
