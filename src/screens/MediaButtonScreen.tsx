// src/screens/MediaButtonScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { MediaButtonEvent } from '../types/models';

const { MediaButtonModule } = NativeModules as any;
const mediaEmitter = MediaButtonModule ? new NativeEventEmitter(MediaButtonModule) : null;

const MediaButtonScreen: React.FC = () => {
  const [events, setEvents] = useState<MediaButtonEvent[]>([]);

  useEffect(() => {
    if (!mediaEmitter) return;
    const sub = mediaEmitter.addListener('onMediaButton', (e) => {
      const event = e as MediaButtonEvent;
      setEvents(prev => [event, ...prev]);
    });
    return () => {
      sub.remove();
    };
  }, []);

  const renderItem = ({ item }: { item: MediaButtonEvent }) => (
    <View style={styles.row}>
      <Text>{new Date(item.timestamp).toLocaleTimeString()}: {item.eventType}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { paddingVertical: 6 },
});

export default MediaButtonScreen;
