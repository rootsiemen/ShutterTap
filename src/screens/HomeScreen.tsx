// src/screens/HomeScreen.tsx — polished entry point: status + quick actions.
// Reads only real BluetoothContext state; never invents device data.

import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, AppHeader, Card, StatusBadge } from '../components/ui';
import { Button } from '../components/buttons';
import { EmptyState, NoticeCard } from '../components/states';
import { AppIcon, IconName } from '../components/AppIcon';
import { BluetoothContext } from '../state/BluetoothContext';
import { nativeCapabilities } from '../native/modules';
import { spacing, typography, useAppTheme } from '../theme';

const QUICK_ACTIONS: Array<{
  route: string;
  icon: IconName;
  title: string;
  hint: string;
}> = [
  {
    route: 'Device',
    icon: 'bluetooth',
    title: 'Connect',
    hint: 'Find earbuds',
  },
  {
    route: 'Camera',
    icon: 'camera',
    title: 'Camera',
    hint: 'Preview & capture',
  },
  {
    route: 'Gesture',
    icon: 'gesture',
    title: 'Gestures',
    hint: 'Map taps to shots',
  },
  {
    route: 'Gallery',
    icon: 'gallery',
    title: 'Gallery',
    hint: 'Review captures',
  },
];

const HomeScreen = () => {
  const { colors, dark } = useAppTheme();
  const navigation = useNavigation<any>();
  const {
    connectedDevice,
    startScan,
    stopScan,
    scanning,
    error,
    connecting,
  } = useContext(BluetoothContext);

  const bluetoothReady = nativeCapabilities.bluetooth;

  return (
    <Screen scrollable>
      <AppHeader
        title="ShutterTap"
        subtitle="Hands-free camera shutter"
        right={
          <View
            style={[
              styles.logo,
              { backgroundColor: colors.primarySoft },
            ]}>
            <AppIcon
              name="camera"
              size={26}
              color={dark ? colors.primaryBright : colors.primary}
            />
          </View>
        }
      />

      {!bluetoothReady ? (
        <View style={{ marginBottom: spacing.cardGap }}>
          <NoticeCard
            tone="brand"
            title="Bluetooth bridge not installed yet"
            message="Discovery and connection screens show their designed empty states until the native module lands. Nothing here is simulated."
          />
        </View>
      ) : null}

      <Card style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              EARPIECE LINK
            </Text>
            <Text
              style={[typography.cardTitle, { color: colors.text }]}>
              {connectedDevice?.name ?? 'Not connected'}
            </Text>
            {connecting ? (
              <Text
                style={[typography.secondary, { color: colors.warning }]}>
                Connecting…
              </Text>
            ) : error ? (
              <Text
                style={[typography.secondary, { color: colors.error }]}>
                {error}
              </Text>
            ) : (
              <Text
                style={[
                  typography.secondary,
                  { color: colors.textSecondary },
                ]}>
                {connectedDevice
                  ? 'Ready — gestures will trigger the camera.'
                  : 'Pair earbuds to enable the shutter remote.'}
              </Text>
            )}
          </View>
          <StatusBadge
            tone={
              connectedDevice ? 'success' : scanning ? 'brand' : 'neutral'
            }
            label={
              connectedDevice
                ? 'Linked'
                : scanning
                  ? 'Scanning'
                  : 'Idle'
            }
          />
        </View>
        <View style={styles.statusActions}>
          {scanning ? (
            <Button
              title="Stop scan"
              variant="secondary"
              onPress={stopScan}
              icon="stop"
              fullWidth
            />
          ) : (
            <Button
              title="Scan for earbuds"
              onPress={startScan}
              icon="search"
              fullWidth
            />
          )}
          <Button
            title="Open devices"
            variant="ghost"
            onPress={() => navigation.navigate('Device')}
          />
        </View>
      </Card>

      <Text style={[typography.sectionTitle, styles.sectionTitle, { color: colors.text }]}>
        Get started
      </Text>
      <View style={styles.grid}>
        {QUICK_ACTIONS.map(a => (
          <TouchableOpacity
            key={a.route}
            onPress={() => navigation.navigate(a.route)}
            accessibilityRole="button"
            accessibilityLabel={`${a.title}: ${a.hint}`}
            style={[
              styles.tile,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <View
              style={[
                styles.tileIcon,
                { backgroundColor: colors.primarySoft },
              ]}>
              <AppIcon
                name={a.icon}
                size={24}
                color={dark ? colors.primaryBright : colors.primary}
              />
            </View>
            <Text style={[typography.bodyStrong, { color: colors.text }]}>
              {a.title}
            </Text>
            <Text
              style={[typography.caption, { color: colors.textSecondary }]}>
              {a.hint}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!connectedDevice && !scanning ? (
        <View style={{ marginTop: spacing.lg }}>
          <EmptyState
            icon="headphones"
            title="No earpiece linked"
            message="Put your earbuds in pairing mode, then scan from the Device tab to link them as a camera remote."
            actionLabel="Go to Device"
            onAction={() => navigation.navigate('Device')}
          />
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: { gap: spacing.lg },
  statusRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  statusActions: { gap: spacing.sm },
  sectionTitle: { marginTop: spacing.xxl, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.cardGap },
  tile: {
    flexBasis: '47.5%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
    gap: 4,
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
});

export default HomeScreen;
