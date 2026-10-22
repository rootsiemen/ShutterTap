// src/screens/DeviceScreen.tsx — Bluetooth discovery (reference 1) +
// connection progress (reference 2). All states reflect the real
// BluetoothContext; no fake devices, no simulated connections.

import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen, AppHeader, SectionHeader } from '../components/ui';
import { Button } from '../components/buttons';
import { EmptyState, ErrorView, NoticeCard } from '../components/states';
import { ConnectingOverlay, DeviceCard, ScanRadar } from '../components/device';
import { BluetoothContext } from '../state/BluetoothContext';
import { nativeCapabilities } from '../native/modules';
import { spacing, typography, useAppTheme } from '../theme';

const TROUBLESHOOTING = [
  'Put the earbuds in pairing mode (usually a long-press on the case button).',
  'Keep the earbuds within a metre of the phone during discovery.',
  'If the earbuds paired with another phone, disconnect them there first.',
  'Toggle the phone Bluetooth off and on, then scan again.',
];

const DeviceScreen = () => {
  const { colors } = useAppTheme();
  const {
    devices,
    connectedDevice,
    connectToDevice,
    startScan,
    stopScan,
    scanning,
    error,
    connecting,
  } = useContext(BluetoothContext);

  const [pendingAddress, setPendingAddress] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const bluetoothReady = nativeCapabilities.bluetooth;
  const pendingDevice = devices.find(d => d.address === pendingAddress);
  const overlayVisible =
    bluetoothReady &&
    pendingAddress != null &&
    (connecting === true || !!error) &&
    !dismissed;

  const handleConnect = (address: string) => {
    // Ignore repeated taps while an attempt is already in flight so two
    // native connect calls can't race each other.
    if (connecting === true) {
      return;
    }
    setPendingAddress(address);
    setDismissed(false);
    connectToDevice(address);
  };

  const handleScan = () => {
    setDismissed(false);
    startScan();
  };

  return (
    <Screen>
      <AppHeader
        title="Devices"
        subtitle={
          connectedDevice
            ? `Linked to ${connectedDevice.name}`
            : 'Find and link your earbuds'
        }
      />

      {!bluetoothReady ? (
        <NoticeCard
          tone="brand"
          title="Bluetooth bridge not installed yet"
          message="The layout below is the designed discovery experience. Live scanning lights up automatically once the native module lands."
        />
      ) : null}

      <FlatList
        data={bluetoothReady ? devices : []}
        keyExtractor={item => item.address}
        ListHeaderComponent={
          <View style={styles.hero}>
            <ScanRadar scanning={bluetoothReady && scanning} />
            <Text
              style={[typography.sectionTitle, { color: colors.text }]}>
              {scanning
                ? 'Looking for devices nearby…'
                : connectedDevice
                  ? 'Earpiece linked'
                  : devices.length > 0
                    ? `${devices.length} device${devices.length === 1 ? '' : 's'} found`
                    : 'Ready to scan'}
            </Text>
            <Text
              style={[
                typography.secondary,
                { color: colors.textSecondary, textAlign: 'center' },
              ]}>
              {scanning
                ? 'Keep your earbuds in pairing mode and nearby.'
                : 'Put your earbuds in pairing mode, then start a scan.'}
            </Text>
            <View style={styles.heroActions}>
              {scanning ? (
                <Button
                  title="Stop scan"
                  variant="secondary"
                  onPress={stopScan}
                  icon="stop"
                />
              ) : (
                <Button
                  title="Scan for devices"
                  onPress={handleScan}
                  icon="search"
                />
              )}
              <Button
                title={showHelp ? 'Hide help' : 'Help'}
                variant="ghost"
                onPress={() => setShowHelp(v => !v)}
                icon="help"
              />
            </View>
            {showHelp ? (
              <View
                style={[
                  styles.help,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}>
                {TROUBLESHOOTING.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text
                      style={[
                        typography.numeric,
                        { color: colors.primaryBright },
                      ]}>
                      {i + 1}.
                    </Text>
                    <Text
                      style={[
                        typography.secondary,
                        { color: colors.textSecondary, flex: 1 },
                      ]}>
                      {tip}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            {devices.length > 0 ? (
              <View style={{ alignSelf: 'stretch' }}>
                <SectionHeader title="Nearby devices" />
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            connected={connectedDevice?.address === item.address}
            connecting={connecting === true && pendingAddress === item.address}
            onConnect={() => handleConnect(item.address)}
          />
        )}
        ListEmptyComponent={
          error && !scanning ? (
            <ErrorView message={error} onRetry={handleScan} />
          ) : (
            <EmptyState
              icon="bluetooth"
              title={scanning ? 'Scanning…' : 'No devices yet'}
              message={
                scanning
                  ? 'Devices appear here as soon as they advertise.'
                  : 'Start a scan to discover earbuds nearby.'
              }
              actionLabel={scanning ? undefined : 'Scan for devices'}
              onAction={scanning ? undefined : handleScan}
            />
          )
        }
        contentContainerStyle={{ paddingBottom: spacing.xxl, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />

      <ConnectingOverlay
        visible={overlayVisible}
        deviceName={pendingDevice?.name ?? pendingAddress ?? undefined}
        // While an attempt is in flight the overlay shows progress; a
        // failure surfaces only once `connecting` clears, so a stale
        // previous error can never masquerade as the current result.
        error={dismissed || connecting ? undefined : error}
        onCancel={() => setDismissed(true)}
        onRetry={
          pendingAddress ? () => handleConnect(pendingAddress) : undefined
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm },
  heroActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  help: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tipRow: { flexDirection: 'row', gap: spacing.sm },
});

export default DeviceScreen;
