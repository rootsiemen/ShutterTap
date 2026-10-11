// src/screens/GalleryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, NativeModules } from 'react-native';

// NOTE: Previously used `react-native-fs` to enumerate media files. To avoid adding a native module dependency,
// we now start with an empty media list and display a placeholder message when no media is present.
// This keeps the UI functional without requiring additional native linking.

const GalleryScreen = () => {
const { MediaButtonModule } = NativeModules as any;

  const [media, setMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  // Load media on mount and after capture (simple approach: reload each focus)
  useEffect(() => {
    if (!MediaButtonModule?.listMedia) {
      // Native module not installed (see ST-P0-07): show explicit state, don't throw.
      setError('Native media module unavailable');
      setLoading(false);
      return;
    }
    MediaButtonModule.listMedia()
      .then((arr: any) => {
        setMedia(arr);
        setLoading(false);
      })
      .catch((e: any) => {
        setError(e.message || 'Failed to load gallery');
        setLoading(false);
      });
  }, [MediaButtonModule]);

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.item}>
      {item.endsWith('.mp4') ? (
        <Text>[Video] {item.split('/').pop()}</Text>
      ) : (
        <Image source={{ uri: item }} style={styles.image} />
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text>No media available.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : media.length > 0 ? (
        <FlatList data={media} renderItem={renderItem} keyExtractor={i => i} numColumns={3} />
      ) : (
        renderEmpty()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  item: { flex: 1, margin: 4 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', aspectRatio: 1 },
});

export default GalleryScreen;
