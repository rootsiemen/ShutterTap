// src/screens/CameraScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Button, StyleSheet, NativeModules, findNodeHandle, Text } from 'react-native';

const { CameraModule } = NativeModules as any;

const CameraScreen = () => {
  const previewRef = useRef(null);
  const [status, setStatus] = React.useState('Ready');
  const [recording, setRecording] = React.useState(false);

  useEffect(() => {
    const viewTag = findNodeHandle(previewRef.current);
    if (viewTag) {
      // bindPreview may be absent when the native module isn't installed (ST-P0-07).
      const maybePromise = CameraModule?.bindPreview?.(viewTag);
      if (maybePromise && typeof maybePromise.catch === 'function') {
        maybePromise.catch((e: any) => setStatus(`Bind error: ${e.message || e}`));
      } else if (!CameraModule?.bindPreview) {
        setStatus('Camera unavailable (native module missing)');
      }
    }
    return () => {
      CameraModule?.unbindPreview?.();
    };
  }, []);

  const takePhoto = async () => {
    if (!CameraModule?.takePhoto) {
      setStatus('Camera unavailable (native module missing)');
      return;
    }
    setStatus('Capturing photo...');
    try {
      const uri = await CameraModule?.takePhoto?.();
      setStatus(`Photo saved: ${uri}`);
    } catch (e: any) {
      setStatus(`Photo error: ${e.message || e}`);
    }
  };

  const toggleFlash = () => {
    CameraModule?.toggleFlash?.();
    setStatus(prev => (prev.includes('Flash') ? prev.replace('ON', 'OFF') : 'Flash ON'));
  };

  const switchCamera = () => {
    CameraModule?.switchCamera?.();
    setStatus('Camera switched');
  };

  const startVideo = async () => {
    if (!CameraModule?.startVideo) {
      setStatus('Camera unavailable (native module missing)');
      return;
    }
    setStatus('Starting video...');
    try {
      const uri = await CameraModule?.startVideo?.();
      setRecording(true);
      setStatus(`Recording video to ${uri}`);
    } catch (e: any) {
      setStatus(`Video start error: ${e.message || e}`);
    }
  };

  const stopVideo = async () => {
    try {
      await CameraModule?.stopVideo?.();
      setRecording(false);
      setStatus('Video stopped');
    } catch (e: any) {
      setStatus(`Video stop error: ${e.message || e}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Native preview will be rendered here */}
      <View ref={previewRef} style={styles.preview} />
      <Text style={styles.status}>{status}</Text>
      <View style={styles.controls}>
        <Button title="Photo" onPress={takePhoto} />
        <Button title={recording ? 'Stop Video' : 'Start Video'} onPress={recording ? stopVideo : startVideo} />
        <Button title="Flash" onPress={toggleFlash} />
        <Button title="Switch" onPress={switchCamera} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  preview: { flex: 1, backgroundColor: '#000' },
  status: { marginTop: 4, color: '#555' },
  controls: { flexDirection: 'row', justifyContent: 'space-around', padding: 8 },
});

export default CameraScreen;
