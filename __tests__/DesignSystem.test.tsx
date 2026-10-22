// __tests__/DesignSystem.test.tsx — guards the ShutterTap design tokens
// and shared components against regressions (colors, type scale, render).
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {
  darkColors,
  lightColors,
  spacing,
  radii,
  typography,
  motion,
  touchTargetMin,
  withAlpha,
} from '../src/theme';
import { AppIcon, IconName } from '../src/components/AppIcon';
import { Button } from '../src/components/buttons';
import { StatusBadge } from '../src/components/ui';
import { EmptyState, LoadingView, ErrorView } from '../src/components/states';
import { ScanRadar } from '../src/components/device';
import {
  getBluetoothModule,
  getCameraModule,
  getMediaButtonModule,
} from '../src/native/modules';

const HEX = /^#([0-9a-fA-F]{6})$/;
const COLOR_OR_RGBA = /^(#([0-9a-fA-F]{6})|rgba?\()/;

describe('design tokens', () => {
  test('dark + light palettes expose the same semantic keys', () => {
    expect(Object.keys(lightColors).sort()).toEqual(
      Object.keys(darkColors).sort(),
    );
  });

  test('all solid colors are 6-digit hex', () => {
    for (const palette of [darkColors, lightColors]) {
      // Tinted translucents are intentionally rgba(); everything else is hex.
      const translucent = ['overlay', 'scrim', 'primarySoft'];
      const solids = Object.entries(palette).filter(
        ([key]) => !translucent.includes(key),
      );
      expect(solids.length).toBeGreaterThan(10);
      for (const [, value] of solids) {
        expect(value).toMatch(HEX);
      }
      for (const key of translucent) {
        const value: string = palette[key as keyof typeof palette];
        expect(value).toMatch(COLOR_OR_RGBA);
      }
    }
  });

  test('text colors differ from backgrounds (basic contrast sanity)', () => {
    expect(darkColors.text).not.toBe(darkColors.background);
    expect(lightColors.text).not.toBe(lightColors.background);
    expect(darkColors.text).not.toBe(lightColors.text);
  });

  test('base spacing scale is ascending', () => {
    const base = [
      spacing.xxs,
      spacing.xs,
      spacing.sm,
      spacing.md,
      spacing.lg,
      spacing.xl,
      spacing.xxl,
      spacing.xxxl,
      spacing.huge,
    ];
    const sorted = [...base].sort((a, b) => a - b);
    expect(base).toEqual(sorted);
  });

  test('radii scale is ascending', () => {
    const values = Object.values(radii);
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  });

  test('every type style has lineHeight >= fontSize', () => {
    for (const style of Object.values(typography)) {
      expect(style.lineHeight).toBeGreaterThanOrEqual(style.fontSize);
    }
  });

  test('motion durations are positive and ordered', () => {
    expect(motion.fast).toBeGreaterThan(0);
    expect(motion.fast).toBeLessThanOrEqual(motion.base);
    expect(motion.base).toBeLessThanOrEqual(motion.slow);
  });

  test('minimum touch target is 44pt', () => {
    expect(touchTargetMin).toBe(44);
  });
});

describe('withAlpha', () => {
  test('appends valid alpha suffixes byte-identically', () => {
    expect(withAlpha('#8B5CF6', '1A')).toBe('#8B5CF61A');
    expect(withAlpha('#8B5CF6', '2E')).toBe('#8B5CF62E');
    expect(withAlpha('#8B5CF6', '55')).toBe('#8B5CF655');
    expect(withAlpha('#8B5CF6', '22')).toBe('#8B5CF622');
  });

  test('falls back to the opaque token for non-hex input', () => {
    // A future rgba() accent must never produce an invalid color string.
    expect(withAlpha('rgba(139, 92, 246, 0.14)', '1A')).toBe(
      'rgba(139, 92, 246, 0.14)',
    );
    expect(withAlpha('#8B5CF6', 'XYZ')).toBe('#8B5CF6');
    expect(withAlpha('#FFF', '1A')).toBe('#FFF');
    expect(withAlpha('', '')).toBe('');
  });
});

describe('native module layer', () => {
  test('missing bridges resolve to undefined without throwing', () => {
    expect(() => getBluetoothModule()).not.toThrow();
    expect(() => getCameraModule()).not.toThrow();
    expect(() => getMediaButtonModule()).not.toThrow();
    expect(getBluetoothModule()).toBeUndefined();
    expect(getCameraModule()).toBeUndefined();
    expect(getMediaButtonModule()).toBeUndefined();
  });
});

describe('shared components', () => {
  const icons: IconName[] = [
    'home',
    'bluetooth',
    'gesture',
    'camera',
    'gallery',
    'media',
    'check',
    'x',
    'alert',
    'info',
    'help',
    'refresh',
    'chevronRight',
    'chevronDown',
    'arrowLeft',
    'flash',
    'swap',
    'plus',
    'play',
    'pause',
    'stop',
    'video',
    'headphones',
    'image',
    'search',
    'record',
    'signal',
    'lock',
  ];

  test.each(icons)('AppIcon "%s" renders', name => {
    expect(() =>
      ReactTestRenderer.create(<AppIcon name={name} />),
    ).not.toThrow();
  });

  test('Button / StatusBadge / states render', async () => {
    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <>
          <Button title="Scan" onPress={() => {}} />
          <StatusBadge tone="success" label="Connected" />
          <LoadingView message="Loading…" />
          <EmptyState icon="camera" title="Empty" />
          <ErrorView message="Boom" />
          <ScanRadar scanning={false} />
        </>,
      );
    });
  });
});
