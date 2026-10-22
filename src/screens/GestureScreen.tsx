// src/screens/GestureScreen.tsx — gesture → camera-action mapping.
// Persistence behavior is unchanged (native side owns storage); only the
// presentation is redesigned. Unknown native state is shown as "Not set",
// never guessed.

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen, AppHeader, Card, SectionHeader } from '../components/ui';
import { EmptyState, LoadingView, NoticeCard } from '../components/states';
import { AppIcon } from '../components/AppIcon';
import { getMediaButtonModule } from '../native/modules';
import { CameraAction, GestureMapping, GestureType } from '../types/models';
import { spacing, typography, useAppTheme } from '../theme';

const GESTURE_META: Record<GestureType, { title: string; hint: string }> = {
  [GestureType.SINGLE_TAP]: { title: 'Single tap', hint: 'One quick press' },
  [GestureType.DOUBLE_TAP]: { title: 'Double tap', hint: 'Two quick presses' },
  [GestureType.TRIPLE_TAP]: {
    title: 'Triple tap',
    hint: 'Three quick presses',
  },
  [GestureType.LONG_PRESS]: { title: 'Long press', hint: 'Press and hold' },
};

const ACTION_LABELS: Record<CameraAction, string> = {
  [CameraAction.NONE]: 'No action',
  [CameraAction.TAKE_PHOTO]: 'Take photo',
  [CameraAction.START_VIDEO]: 'Start video',
  [CameraAction.STOP_VIDEO]: 'Stop video',
  [CameraAction.SWITCH_CAMERA]: 'Switch camera',
  [CameraAction.TOGGLE_FLASH]: 'Toggle flash',
};

const ORDERED_GESTURES = [
  GestureType.SINGLE_TAP,
  GestureType.DOUBLE_TAP,
  GestureType.TRIPLE_TAP,
  GestureType.LONG_PRESS,
];

const allCameraActions = Object.values(CameraAction);

const GestureScreen = () => {
  const { colors, dark } = useAppTheme();
  const [mappings, setMappings] = useState<GestureMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();

  useEffect(() => {
    const mod = getMediaButtonModule();
    if (!mod?.getGestureMappings) {
      setUnavailable(true);
      setLoading(false);
      return;
    }
    mod
      .getGestureMappings()
      .then((arr: GestureMapping[]) => {
        setMappings(Array.isArray(arr) ? arr : []);
        setLoading(false);
      })
      .catch((e: any) => {
        setSaveError(e?.message || 'Failed to load gesture mappings');
        setLoading(false);
      });
  }, []);

  const cycleAction = (current: CameraAction): CameraAction => {
    const idx = allCameraActions.indexOf(current);
    return allCameraActions[(idx + 1) % allCameraActions.length];
  };

  const updateMapping = (gestureType: GestureType) => {
    if (unavailable) {
      return;
    }
    const old = mappings.find(m => m.gestureType === gestureType);
    if (!old) {
      return;
    }
    const newAction = cycleAction(old.cameraAction as CameraAction);
    const next = mappings.map(m =>
      m.gestureType === gestureType ? { ...m, cameraAction: newAction } : m,
    );
    setMappings(next);
    getMediaButtonModule()
      ?.setGestureMappings?.(next)
      ?.catch?.((e: any) => {
        setSaveError(e?.message || 'Failed to save gesture mappings');
      });
  };

  const actionFor = (g: GestureType): CameraAction | undefined =>
    mappings.find(m => m.gestureType === g)?.cameraAction as
      | CameraAction
      | undefined;

  if (loading) {
    return (
      <Screen>
        <AppHeader
          title="Gestures"
          subtitle="Map earbud taps to camera actions"
        />
        <LoadingView message="Loading gesture mappings…" />
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <AppHeader
        title="Gestures"
        subtitle="Map earbud taps to camera actions"
      />

      {unavailable ? (
        <View style={{ marginBottom: spacing.cardGap }}>
          <NoticeCard
            tone="brand"
            title="Gesture storage lives in the native module"
            message="Mapping controls activate once the media native module lands. Your saved mappings are untouched."
          />
        </View>
      ) : null}
      {saveError ? (
        <View style={{ marginBottom: spacing.cardGap }}>
          <NoticeCard
            tone="warning"
            title="Couldn't reach gesture storage"
            message={saveError}
          />
        </View>
      ) : null}

      <SectionHeader title="Earbud gestures" />
      <Card style={styles.list}>
        {ORDERED_GESTURES.map((g, i) => {
          const action = actionFor(g);
          const known = !unavailable && action != null;
          const active = known && action !== CameraAction.NONE;
          return (
            <TouchableOpacity
              key={g}
              onPress={() => updateMapping(g)}
              disabled={unavailable}
              accessibilityRole="button"
              accessibilityLabel={
                known
                  ? `${GESTURE_META[g].title}, mapped to ${ACTION_LABELS[action]}. Tap to change.`
                  : `${GESTURE_META[g].title}, mapping unknown.`
              }
              style={[
                styles.row,
                i < ORDERED_GESTURES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.divider,
                },
              ]}>
              <View
                style={[
                  styles.gestureIcon,
                  { backgroundColor: colors.primarySoft },
                ]}>
                <AppIcon
                  name="gesture"
                  size={22}
                  color={dark ? colors.primaryBright : colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[typography.bodyStrong, { color: colors.text }]}>
                  {GESTURE_META[g].title}
                </Text>
                <Text
                  style={[
                    typography.secondary,
                    { color: colors.textSecondary },
                  ]}>
                  {GESTURE_META[g].hint}
                </Text>
              </View>
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: active
                      ? colors.primarySoft
                      : colors.elevated,
                    borderColor: colors.border,
                  },
                ]}>
                <Text
                  style={[
                    typography.buttonSmall,
                    {
                      color: active
                        ? dark
                          ? colors.primaryBright
                          : colors.primary
                        : colors.textMuted,
                    },
                  ]}>
                  {known ? ACTION_LABELS[action] : 'Not set'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </Card>

      {!unavailable && mappings.length === 0 && !saveError ? (
        <EmptyState
          icon="gesture"
          title="No mappings yet"
          message="The native module returned no gesture mappings. Mappings you save will appear here."
        />
      ) : null}

      <Text
        style={[
          typography.caption,
          { color: colors.textMuted, marginTop: spacing.lg },
        ]}>
        {unavailable
          ? 'The four gestures above are what ShutterTap supports; their saved actions load with the native module.'
          : 'Tap a row to switch its camera action. Changes save automatically.'}
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: { padding: 0, paddingHorizontal: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
    minHeight: 68,
  },
  gestureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 9999,
    borderWidth: 1,
  },
});

export default GestureScreen;
