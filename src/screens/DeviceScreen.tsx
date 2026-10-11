// src/screens/DeviceScreen.tsx
import React, { useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { BluetoothContext } from '../state/BluetoothContext';
import { BluetoothDevice } from '../types/models';

const Separator = () => <View style={styles.separator} />;

const DeviceScreen = () => {
  const { devices, connectedDevice, connectToDevice, scanning, error, connecting } = useContext(BluetoothContext);

  const renderItem = ({ item }: { item: BluetoothDevice }) => {
    const isConnected = connectedDevice?.address === item.address;
    return (
      <View style={styles.row}>
        <Text style={styles.deviceName}>{item.name}</Text>
        {isConnected ? (
          <Text style={styles.connected}>Connected</Text>
        ) : (
          <Button title="Connect" onPress={() => connectToDevice(item.address)} />
        )}
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Devices</Text>
      {scanning && <ActivityIndicator size="small" style={styles.scanningIndicator} />}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {connecting && <Text style={styles.connectingText}>Connecting...</Text>}
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item) => item.address}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  deviceName: { fontSize: 16 },
  separator: { height: 1, backgroundColor: '#ccc' },
  scanningIndicator: { marginVertical: 8 },
  errorText: { color: 'red', marginBottom: 8 },
  connectingText: { color: 'orange', marginBottom: 8 },
  connected: { color: 'green' },
});

export default DeviceScreen;
