// src/screens/CameraScreen.tsx — immersive capture experience (reference 3).
// Preview stays maximal; controls hug the safe areas. All native calls
// (bindPreview/takePhoto/toggleFlash/switchCamera/startVideo/stopVideo/
// unbindPreview) are preserved behind the safe module layer.

import React, { useEffect, useRef, useState } from 'react';
import { findNodeHandle, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Screen, SegmentedControl } from '../components/ui';
import { IconButton, ShutterButton } from '../components/buttons';
import { AppIcon } from '../components/AppIcon';
import { getCameraModule } from '../native/modules';
import { spacing, typography, useAppTheme } from '../theme';

type CameraMode = 'PHOTO' | 'VIDEO';

const formatElapsed = (s: number) => {
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${rest.toString().padStart(2, '0')}`;
};

const CameraScreen = () => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const previewRef = useRef<View>(null);

  const [mode, setMode] = useState<CameraMode>('PHOTO');
  const [status, setStatus] = useState('Ready');
  const [recording, setRecording] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const camera = getCameraModule();
  const cameraReady = camera != null;

  useEffect(() => {
    if (!cameraReady) {
      setStatus('Camera unavailable (native module missing)');
      return;
    }
    try {
      const viewTag = findNodeHandle(previewRef.current);
      if (viewTag) {
        const maybePromise = camera?.bindPreview?.(viewTag);
        if (maybePromise && typeof maybePromise.catch === 'function') {
          maybePromise.catch((e: any) =>
            setStatus(`Preview error: ${e?.message ?? e}`),
          );
        }
      }
    } catch (e: any) {
      setStatus(`Preview error: ${e?.message ?? e}`);
    }
    return () => {
      try {
        camera?.unbindPreview?.();
      } catch {
        // cleanup must never throw (ST-P0-02 class)
      }
    };
    // Bind once on mount; the native view owns the session afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!recording) {
      setElapsed(0);
      return;
    }
    const t = setInterval(() => setElapsed(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const requireCamera = () => {
    if (!cameraReady) {
      setStatus('Camera unavailable (native module missing)');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    if (!requireCamera()) {
      return;
    }
    setStatus('Capturing photo…');
    try {
      const uri = await camera?.takePhoto?.();
      setStatus(`Photo saved: ${uri}`);
    } catch (e: any) {
      setStatus(`Photo error: ${e?.message ?? e}`);
    }
  };

  const toggleFlash = () => {
    if (!requireCamera()) {
      return;
    }
    try {
      camera?.toggleFlash?.();
      setFlashOn(v => !v);
      setStatus(flashOn ? 'Flash off' : 'Flash on');
    } catch (e: any) {
      setStatus(`Flash error: ${e?.message ?? e}`);
    }
  };

  const switchCamera = () => {
    if (!requireCamera()) {
      return;
    }
    try {
      camera?.switchCamera?.();
      setStatus('Camera switched');
    } catch (e: any) {
      setStatus(`Switch error: ${e?.message ?? e}`);
    }
  };

  const startVideo = async () => {
    if (!requireCamera()) {
      return;
    }
    setStatus('Starting video…');
    try {
      const uri = await camera?.startVideo?.();
      setRecording(true);
      setStatus(`Recording to ${uri}`);
    } catch (e: any) {
      setStatus(`Video start error: ${e?.message ?? e}`);
    }
  };

  const stopVideo = async () => {
    try {
      await camera?.stopVideo?.();
    } catch (e: any) {
      setStatus(`Video stop error: ${e?.message ?? e}`);
      return;
    }
    setRecording(false);
    setStatus('Video stopped');
  };

  const onShutter = () => {
    if (mode === 'PHOTO') {
      takePhoto();
    } else if (recording) {
      stopVideo();
    } else {
      startVideo();
    }
  };

  return (
    <Screen immersive>
      <View style={[styles.root, { backgroundColor: colors.cameraChrome }]}>
        {/* Top chrome */}
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <IconButton
            icon="flash"
            label={flashOn ? 'Turn flash off' : 'Turn flash on'}
            variant="chrome"
            color={flashOn ? colors.warning : colors.cameraControl}
            onPress={toggleFlash}
          />
          {recording ? (
            <View style={styles.recPill} accessible accessibilityLabel={`Recording ${formatElapsed(elapsed)}`}>
              <AppIcon name="record" size={12} color={colors.error} />
              <Text style={[typography.status, { color: colors.cameraControl }]}>
                {formatElapsed(elapsed)}
              </Text>
            </View>
          ) : (
            <Text style={[typography.status, { color: colors.cameraControl, opacity: 0.7 }]}>
              {mode === 'PHOTO' ? 'PHOTO MODE' : 'VIDEO MODE'}
            </Text>
          )}
          <IconButton
            icon="swap"
            label="Switch camera"
            variant="chrome"
            onPress={switchCamera}
          />
        </View>

        {/* Preview */}
        <View
          style={[styles.preview, { backgroundColor: colors.cameraChrome }]}
          ref={previewRef}>
          {!cameraReady ? (
            <View style={styles.unavailable} accessible accessibilityLabel="Camera unavailable">
              <View
                style={[
                  styles.unavailableMedallion,
                  { backgroundColor: colors.cameraWell },
                ]}>
                <AppIcon name="camera" size={40} color={colors.cameraMuted} />
              </View>
              <Text
                style={[
                  typography.cardTitle,
                  { color: colors.cameraControl, textAlign: 'center' },
                ]}>
                Camera unavailable
              </Text>
              <Text
                style={[
                  typography.secondary,
                  {
                    color: colors.cameraMuted,
                    textAlign: 'center',
                    paddingHorizontal: spacing.xxxl,
                  },
                ]}>
                The native camera module is not installed yet.
                Capture controls stay visible so the layout can be verified.
              </Text>
            </View>
          ) : null}
          {/* Status toast */}
          <View style={styles.statusWrap} pointerEvents="none">
            <View style={styles.statusPill}>
              <Text
                style={[typography.caption, { color: colors.cameraControl }]}
                numberOfLines={2}>
                {status}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom chrome */}
        <View
          style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
          <SegmentedControl
            options={['PHOTO', 'VIDEO']}
            value={mode}
            onChange={v => setMode(v as CameraMode)}
            accessibilityLabel="Camera mode"
          />
          <View style={styles.controls}>
            <IconButton
              icon="image"
              label="Open gallery"
              variant="chrome"
              onPress={() => navigation.navigate('Gallery')}
            />
            <ShutterButton
              onPress={onShutter}
              label={
                mode === 'PHOTO'
                  ? 'Take photo'
                  : recording
                    ? 'Stop recording'
                    : 'Start recording'
              }
              recording={recording && mode === 'VIDEO'}
            />
            <View style={{ width: 44 }}>
              {mode === 'VIDEO' && recording ? (
                <IconButton
                  icon="stop"
                  label="Stop recording"
                  variant="chrome"
                  onPress={stopVideo}
                />
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  recPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 9999,
  },
  preview: { flex: 1, justifyContent: 'center' },
  unavailable: { alignItems: 'center', gap: spacing.sm },
  unavailableMedallion: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statusWrap: { position: 'absolute', left: 0, right: 0, bottom: 12, alignItems: 'center' },
  statusPill: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 9999,
    maxWidth: '85%',
  },
  bottomBar: { paddingHorizontal: spacing.xxl, gap: spacing.lg },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CameraScreen;
