// src/screens/MediaButtonScreen.tsx — hardware media-button event feed.
// Subscription logic is unchanged (guarded emitter); presentation now shows
// rich event cards, an empty state, and a clear-feed action.

import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeEventEmitter } from 'react-native';
import {
  Screen,
  AppHeader,
  Card,
  SectionHeader,
} from '../components/ui';
import { EmptyState, NoticeCard } from '../components/states';
import { Button } from '../components/buttons';
import { AppIcon, IconName } from '../components/AppIcon';
import { getMediaButtonModule } from '../native/modules';
import { MediaButtonEvent, MediaButtonType } from '../types/models';
import { spacing, typography, useAppTheme } from '../theme';

const EVENT_META: Record<MediaButtonType, { label: string; icon: IconName }> = {
  [MediaButtonType.PLAY_PAUSE]: { label: 'Play / Pause', icon: 'play' },
  [MediaButtonType.NEXT_TRACK]: { label: 'Next track', icon: 'chevronRight' },
  [MediaButtonType.PREVIOUS_TRACK]: {
    label: 'Previous track',
    icon: 'arrowLeft',
  },
  [MediaButtonType.UNKNOWN]: { label: 'Unknown button', icon: 'media' },
};

const formatTime = (ts: number) => {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return '—';
  }
};

const MediaButtonScreen: React.FC = () => {
  const { colors, dark } = useAppTheme();
  const [events, setEvents] = useState<MediaButtonEvent[]>([]);

  const moduleAvailable = getMediaButtonModule() != null;

  useEffect(() => {
    const mod = getMediaButtonModule();
    if (!mod) {
      return;
    }
    const emitter = new NativeEventEmitter(mod as any);
    const sub = emitter.addListener('onMediaButton', e => {
      const event = e as MediaButtonEvent;
      setEvents(prev => [event, ...prev]);
    });
    return () => {
      sub.remove();
    };
  }, []);

  return (
    <Screen>
      <AppHeader
        title="Media buttons"
        subtitle={
          events.length > 0
            ? `${events.length} event${events.length === 1 ? '' : 's'} captured`
            : 'Earbud button presses appear here'
        }
        right={
          events.length > 0 ? (
            <Button
              title="Clear"
              variant="secondary"
              size="sm"
              onPress={() => setEvents([])}
            />
          ) : undefined
        }
      />

      {!moduleAvailable ? (
        <View style={{ marginBottom: spacing.cardGap }}>
          <NoticeCard
            tone="brand"
            title="Media events need the native module"
            message="Presses of your earbud buttons will stream in live once the media bridge lands."
          />
        </View>
      ) : null}

      {events.length === 0 ? (
        <EmptyState
          icon="media"
          title="No button presses yet"
          message="With the media bridge installed, press play/pause, next, or previous on your earbuds and watch each event land here with its timestamp."
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(_, idx) => idx.toString()}
          ListHeaderComponent={
            <SectionHeader title="Recent presses" />
          }
          renderItem={({ item }) => {
            const meta =
              EVENT_META[item.eventType] ?? EVENT_META[MediaButtonType.UNKNOWN];
            return (
              <Card style={styles.eventCard}>
                <View
                  style={[
                    styles.eventIcon,
                    { backgroundColor: colors.primarySoft },
                  ]}>
                  <AppIcon
                    name={meta.icon}
                    size={22}
                    color={dark ? colors.primaryBright : colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[typography.bodyStrong, { color: colors.text }]}>
                    {meta.label}
                  </Text>
                  <Text
                    style={[
                      typography.numeric,
                      { color: colors.textMuted },
                    ]}>
                    {formatTime(item.timestamp)}
                  </Text>
                </View>
              </Card>
            );
          }}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.cardGap,
  },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MediaButtonScreen;
