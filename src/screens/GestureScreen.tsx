import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, NativeModules } from 'react-native';
import { GestureMapping, GestureType, CameraAction } from '../types/models';

const { MediaButtonModule } = NativeModules as any;

const allCameraActions = Object.values(CameraAction);

const GestureScreen = () => {
  const [mappings, setMappings] = useState<GestureMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  // Load mappings on mount
  useEffect(() => {
    if (!MediaButtonModule?.getGestureMappings) {
      // Native module not installed (see ST-P0-07): show explicit state, don't throw.
      setError('Native media module unavailable');
      setLoading(false);
      return;
    }
    MediaButtonModule.getGestureMappings()
      .then((arr: any) => {
        // arr is array of {gestureType: string, cameraAction: string}
        setMappings(arr);
        setLoading(false);
      })
      .catch((e: any) => {
        setError(e.message || 'Failed to load gesture mappings');
        setLoading(false);
      });
  }, []);

  const cycleAction = (current: CameraAction): CameraAction => {
    const idx = allCameraActions.indexOf(current);
    return allCameraActions[(idx + 1) % allCameraActions.length];
  };

  const updateMapping = (gestureType: GestureType) => {
    const old = mappings.find(m => m.gestureType === gestureType);
    if (!old) return;
    const newAction = cycleAction(old.cameraAction as CameraAction);
    const newMappings = mappings.map(m =>
      m.gestureType === gestureType ? { ...m, cameraAction: newAction } : m
    );
    setMappings(newMappings);
    // Persist to native side
    MediaButtonModule?.setGestureMappings?.(newMappings)?.catch?.((e: any) => {
      setError(e.message || 'Failed to save gesture mappings');
    });
  };

  const renderItem = ({ item }: { item: GestureMapping }) => (
    <View style={styles.row}>
      <Text style={styles.gesture}>{item.gestureType}</Text>
      <Button title={item.cameraAction} onPress={() => updateMapping(item.gestureType as GestureType)} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gesture Mapping</Text>
      <FlatList data={mappings} keyExtractor={item => item.gestureType} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  gesture: { fontSize: 16 },
  error: { color: 'red' },
});

export default GestureScreen;

