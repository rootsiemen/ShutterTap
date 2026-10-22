// src/components/ui.tsx — shared layout + surface primitives.
// Every screen composes these instead of inventing one-off containers.

import React, { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radii, spacing, typography, useAppTheme, withAlpha } from '../theme';
import { AppIcon, IconName } from './AppIcon';

// ---------------------------------------------------------------------------
// Screen — safe-area aware root with consistent edge padding.
// ---------------------------------------------------------------------------

interface ScreenProps {
  children: ReactNode;
  padded?: boolean;
  scrollable?: boolean;
  /** Camera-style immersive screens skip top inset + padding. */
  immersive?: boolean;
  style?: ViewStyle;
}

export const Screen = ({
  children,
  padded = true,
  scrollable = false,
  immersive = false,
  style,
}: ScreenProps) => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const container: ViewStyle = {
    flex: 1,
    backgroundColor: immersive ? colors.cameraChrome : colors.background,
    paddingTop: immersive ? 0 : insets.top,
    paddingBottom: immersive ? 0 : insets.bottom,
    paddingHorizontal: padded && !immersive ? spacing.screen : 0,
  };

  if (scrollable) {
    return (
      <View style={[container, style]}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.xxl, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    );
  }
  return <View style={[container, style]}>{children}</View>;
};

// ---------------------------------------------------------------------------
// AppHeader — screen title block.
// ---------------------------------------------------------------------------

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export const AppHeader = ({ title, subtitle, right }: AppHeaderProps) => {
  const { colors } = useAppTheme();
  return (
    <View style={styles.headerRow}>
      <View style={{ flex: 1 }}>
        <Text accessibilityRole="header" style={[typography.screenTitle, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[typography.secondary, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Card — elevated surface.
// ---------------------------------------------------------------------------

export const Card = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) => {
  const { colors, dark } = useAppTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radii.lg,
          padding: spacing.lg,
          borderWidth: dark ? 1 : 0,
          borderColor: colors.border,
        },
        !dark && {
          shadowColor: colors.shadow,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

// ---------------------------------------------------------------------------
// SectionHeader — list section label + optional action.
// ---------------------------------------------------------------------------

export const SectionHeader = ({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) => {
  const { colors, dark } = useAppTheme();
  return (
    <View style={styles.sectionRow}>
      <Text style={[typography.sectionTitle, { color: colors.text }]}>
        {title}
      </Text>
      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}>
          <Text
            style={[
              typography.buttonSmall,
              { color: dark ? colors.primaryBright : colors.primary },
            ]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// ---------------------------------------------------------------------------
// StatusBadge — compact state pill (connection, permission, capture states).
// ---------------------------------------------------------------------------

export type BadgeTone =
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

const toneColor = (
  tone: BadgeTone,
  colors: ReturnType<typeof useAppTheme>['colors'],
  dark: boolean,
) => {
  switch (tone) {
    case 'brand':
      return dark ? colors.primaryBright : colors.primary;
    case 'success':
      return colors.success;
    case 'warning':
      return colors.warning;
    case 'error':
      return colors.error;
    case 'info':
      return colors.info;
    default:
      return colors.textMuted;
  }
};

export const StatusBadge = ({
  tone = 'neutral',
  label,
}: {
  tone?: BadgeTone;
  label: string;
}) => {
  const { colors, dark } = useAppTheme();
  const accent = toneColor(tone, colors, dark);
  return (
    <View
      accessible
      accessibilityLabel={`Status: ${label}`}
      style={[
        styles.badge,
        { backgroundColor: colors.primarySoft, borderColor: colors.border },
        tone !== 'brand' && { backgroundColor: withAlpha(accent, '22') },
      ]}>
      <View style={[styles.badgeDot, { backgroundColor: accent }]} />
      <Text style={[typography.status, { color: accent }]}>{label}</Text>
    </View>
  );
};

// ---------------------------------------------------------------------------
// SegmentedControl — photo/video mode, gesture action picker.
// ---------------------------------------------------------------------------

export const SegmentedControl = ({
  options,
  value,
  onChange,
  accessibilityLabel,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  accessibilityLabel?: string;
}) => {
  const { colors, dark } = useAppTheme();
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tablist"
      style={[
        styles.segment,
        {
          backgroundColor: dark ? colors.elevated : colors.elevated,
          borderColor: colors.border,
        },
      ]}>
      {options.map(opt => {
        const active = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt}
            style={[
              styles.segmentItem,
              active && {
                backgroundColor: dark ? colors.card : colors.card,
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
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ---------------------------------------------------------------------------
// SettingRow — icon + title + subtitle + trailing control.
// ---------------------------------------------------------------------------

export const SettingRow = ({
  icon,
  title,
  subtitle,
  right,
  onPress,
  last = false,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
  last?: boolean;
}) => {
  const { colors, dark } = useAppTheme();
  const content = (
    <View
      style={[
        styles.settingRow,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.divider },
      ]}>
      <View
        style={[
          styles.settingIcon,
          { backgroundColor: colors.primarySoft },
        ]}>
        <AppIcon
          name={icon}
          size={22}
          color={dark ? colors.primaryBright : colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodyStrong, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[typography.secondary, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
      {onPress ? (
        <AppIcon name="chevronRight" size={20} color={colors.textMuted} />
      ) : null}
    </View>
  );
  if (!onPress) {
    return content;
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}>
      {content}
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

export const Divider = () => {
  const { colors } = useAppTheme();
  return <View style={{ height: 1, backgroundColor: colors.divider }} />;
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    gap: 6,
  },
  badgeDot: { width: 8, height: 8, borderRadius: 4 },
  segment: {
    flexDirection: 'row',
    borderRadius: radii.full,
    padding: 4,
    borderWidth: 1,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
