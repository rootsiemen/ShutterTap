// src/components/states.tsx — loading / empty / error / notice states.
// Every screen renders one of these for each data state; no bare Text.

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { radii, spacing, typography, useAppTheme, withAlpha } from '../theme';
import { AppIcon, IconName } from './AppIcon';
import { Button } from './buttons';

const StateShell = ({
  icon,
  iconColor,
  title,
  message,
  children,
}: {
  icon: IconName;
  iconColor: string;
  title: string;
  message?: string;
  children?: React.ReactNode;
}) => {
  const { colors } = useAppTheme();
  return (
    <View style={styles.shell}>
      <View
        style={[styles.medallion, { backgroundColor: colors.primarySoft }]}>
        <AppIcon name={icon} size={34} color={iconColor} />
      </View>
      <Text style={[typography.cardTitle, { color: colors.text }]}>
        {title}
      </Text>
      {message ? (
        <Text
          style={[
            typography.secondary,
            { color: colors.textSecondary, textAlign: 'center' },
          ]}>
          {message}
        </Text>
      ) : null}
      {children}
    </View>
  );
};

export const LoadingView = ({ message = 'Loading…' }: { message?: string }) => {
  const { colors, dark } = useAppTheme();
  return (
    <View style={styles.shell} accessible accessibilityLabel={message}>
      <ActivityIndicator
        size="large"
        color={dark ? colors.primaryBright : colors.primary}
      />
      <Text style={[typography.secondary, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
};

export const EmptyState = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) => {
  const { colors, dark } = useAppTheme();
  return (
    <StateShell
      icon={icon}
      iconColor={dark ? colors.primaryBright : colors.primary}
      title={title}
      message={message}>
      {actionLabel && onAction ? (
        <View style={{ marginTop: spacing.md }}>
          <Button title={actionLabel} onPress={onAction} size="sm" />
        </View>
      ) : null}
    </StateShell>
  );
};

export const ErrorView = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => {
  const { colors } = useAppTheme();
  return (
    <StateShell
      icon="alert"
      iconColor={colors.error}
      title="Something went wrong"
      message={message}>
      {onRetry ? (
        <View style={{ marginTop: spacing.md }}>
          <Button
            title="Try again"
            onPress={onRetry}
            size="sm"
            variant="secondary"
            icon="refresh"
          />
        </View>
      ) : null}
    </StateShell>
  );
};

export const NoticeCard = ({
  tone = 'info',
  title,
  message,
}: {
  tone?: 'info' | 'warning' | 'brand';
  title: string;
  message?: string;
}) => {
  const { colors, dark } = useAppTheme();
  const accent =
    tone === 'warning'
      ? colors.warning
      : tone === 'brand'
        ? dark
          ? colors.primaryBright
          : colors.primary
        : colors.info;
  const icon: IconName = tone === 'brand' ? 'bluetooth' : 'info';
  return (
    <View
      accessible
      accessibilityLabel={`${title}. ${message ?? ''}`}
      style={[
        styles.notice,
        {
          backgroundColor: withAlpha(accent, '1A'),
          borderColor: withAlpha(accent, '55'),
        },
      ]}>
      <AppIcon name={icon} size={22} color={accent} />
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodyStrong, { color: colors.text }]}>
          {title}
        </Text>
        {message ? (
          <Text
            style={[typography.secondary, { color: colors.textSecondary }]}>
            {message}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  medallion: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  notice: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
});
