// src/screens/HomeScreen.tsx
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { BluetoothContext } from '../state/BluetoothContext';

const HomeScreen = () => {
  const {
    connectedDevice,
    startScan,
    stopScan,
    scanning,
    error,
    connecting,
  } = useContext(BluetoothContext);

  const connectedName = connectedDevice?.name ?? 'None';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ShutterTap</Text>
      <Text style={styles.status}>Bluetooth status: {connectedName}</Text>
      {scanning && <ActivityIndicator size="small" style={styles.indicator} />}
      {connecting && <Text style={styles.connecting}>Connecting...</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      <Button title="Scan" onPress={startScan} />
      <Button title="Stop Scan" onPress={stopScan} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  status: { fontSize: 16, marginBottom: 8 },
  indicator: { marginVertical: 8 },
  connecting: { color: 'orange', marginBottom: 8 },
  error: { color: 'red', marginBottom: 8 },
});

export default HomeScreen;
