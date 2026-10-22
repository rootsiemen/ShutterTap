// src/components/AppIcon.tsx — ShutterTap geometric icon set.
//
// Zero-dependency icons drawn with View primitives on a 24pt grid.
// Deliberately NOT Unicode/emoji glyphs, so weight, size, and color stay
// consistent on iOS + Android and honor the active theme. Decorative only:
// meaningful context must come from the parent's accessibilityLabel.

import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

export type IconName =
  | 'home'
  | 'bluetooth'
  | 'gesture'
  | 'camera'
  | 'gallery'
  | 'media'
  | 'check'
  | 'x'
  | 'alert'
  | 'info'
  | 'help'
  | 'refresh'
  | 'chevronRight'
  | 'chevronDown'
  | 'arrowLeft'
  | 'flash'
  | 'swap'
  | 'plus'
  | 'play'
  | 'pause'
  | 'stop'
  | 'video'
  | 'headphones'
  | 'image'
  | 'search'
  | 'record'
  | 'signal'
  | 'lock';

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  /** RSSI level 0–4 for the `signal` icon. */
  level?: number;
}

const GRID = 24;

export const AppIcon = ({
  name,
  size = 24,
  color = '#FFFFFF',
  level = 4,
}: AppIconProps) => {
  const w = Math.max(1.6, size * 0.09); // consistent stroke weight
  const k = size / GRID; // grid scale
  const X = (v: number) => v * k;

  const seg = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number = w,
    opacity = 1,
  ): ViewStyle => {
    const dx = (x2 - x1) * k;
    const dy = (y2 - y1) * k;
    const len = Math.hypot(dx, dy);
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    return {
      position: 'absolute',
      left: ((x1 + x2) / 2) * k - len / 2,
      top: ((y1 + y2) / 2) * k - width / 2,
      width: len,
      height: width,
      borderRadius: width / 2,
      backgroundColor: color,
      opacity,
      transform: [{ rotate: `${ang}deg` }],
    };
  };

  const dot = (x: number, y: number, r: number, opacity = 1): ViewStyle => ({
    position: 'absolute',
    left: X(x) - X(r),
    top: X(y) - X(r),
    width: X(r) * 2,
    height: X(r) * 2,
    borderRadius: X(r),
    backgroundColor: color,
    opacity,
  });

  const ring = (
    x: number,
    y: number,
    r: number,
    width: number = w,
    opacity = 1,
  ): ViewStyle => ({
    position: 'absolute',
    left: X(x) - X(r),
    top: X(y) - X(r),
    width: X(r) * 2,
    height: X(r) * 2,
    borderRadius: X(r),
    borderWidth: width,
    borderColor: color,
    opacity,
  });

  const box = (
    x: number,
    y: number,
    bw: number,
    bh: number,
    radius: number,
    filled: boolean,
    width: number = w,
  ): ViewStyle => ({
    position: 'absolute',
    left: X(x),
    top: X(y),
    width: X(bw),
    height: X(bh),
    borderRadius: X(radius),
    ...(filled
      ? { backgroundColor: color }
      : { borderWidth: width, borderColor: color }),
  });

  const triDown = (
    cx: number,
    top: number,
    halfBase: number,
    height: number,
  ): ViewStyle => ({
    position: 'absolute',
    left: X(cx) - X(halfBase),
    top: X(top),
    width: 0,
    height: 0,
    borderLeftWidth: X(halfBase),
    borderRightWidth: X(halfBase),
    borderBottomWidth: X(height),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color,
  });

  const triUp = (
    cx: number,
    bottom: number,
    halfBase: number,
    height: number,
  ): ViewStyle => ({
    position: 'absolute',
    left: X(cx) - X(halfBase),
    top: X(bottom) - X(height),
    width: 0,
    height: 0,
    borderLeftWidth: X(halfBase),
    borderRightWidth: X(halfBase),
    borderTopWidth: X(height),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: color,
  });

  const triRight = (
    left: number,
    cy: number,
    length: number,
    halfHeight: number,
  ): ViewStyle => ({
    position: 'absolute',
    left: X(left),
    top: X(cy) - X(halfHeight),
    width: 0,
    height: 0,
    borderTopWidth: X(halfHeight),
    borderBottomWidth: X(halfHeight),
    borderLeftWidth: X(length),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: color,
  });

  const renderMark = () => {
    switch (name) {
      case 'home':
        return (
          <>
            <View style={triUp(12, 10.5, 8, 7)} />
            <View
              style={[box(6.5, 10, 11, 10, 1.5, false), { borderTopWidth: 0 }]}
            />
          </>
        );
      case 'bluetooth':
        return (
          <>
            <View style={seg(12, 4, 12, 20)} />
            <View style={seg(6.5, 8, 17.5, 16)} />
            <View style={seg(6.5, 16, 17.5, 8)} />
          </>
        );
      case 'gesture':
        return (
          <>
            <View style={ring(12, 12, 9.5, w, 0.35)} />
            <View style={ring(12, 12, 5.8)} />
            <View style={dot(12, 12, 2.1)} />
          </>
        );
      case 'camera':
        return (
          <>
            <View style={box(6.5, 5.6, 5, 2.4, 1.2, true)} />
            <View style={box(3.5, 8.5, 17, 11, 3, false)} />
            <View style={ring(12, 14, 3.4, w * 1.15)} />
            <View style={dot(17.4, 11.4, 1)} />
          </>
        );
      case 'gallery':
        return (
          <>
            <View style={box(3.5, 3.5, 8, 8, 2, true)} />
            <View style={box(12.5, 3.5, 8, 8, 2, true)} />
            <View style={box(3.5, 12.5, 8, 8, 2, true)} />
            <View style={box(12.5, 12.5, 8, 8, 2, true)} />
          </>
        );
      case 'media':
        return (
          <>
            <View style={seg(4, 6.5, 20, 6.5, w, 0.55)} />
            <View style={seg(4, 12, 20, 12, w, 0.55)} />
            <View style={seg(4, 17.5, 20, 17.5, w, 0.55)} />
            <View style={dot(15.5, 6.5, 2.5)} />
            <View style={dot(8.5, 12, 2.5)} />
            <View style={dot(17, 17.5, 2.5)} />
          </>
        );
      case 'check':
        return (
          <>
            <View style={seg(6.5, 12.5, 10.5, 16.5, w * 1.25)} />
            <View style={seg(10, 17, 17.5, 8, w * 1.25)} />
          </>
        );
      case 'x':
        return (
          <>
            <View style={seg(7, 7, 17, 17, w * 1.1)} />
            <View style={seg(17, 7, 7, 17, w * 1.1)} />
          </>
        );
      case 'alert':
        return (
          <>
            <View style={ring(12, 12, 9)} />
            <View style={seg(12, 7.6, 12, 13, w * 1.1)} />
            <View style={dot(12, 16, 1.4)} />
          </>
        );
      case 'info':
        return (
          <>
            <View style={ring(12, 12, 9)} />
            <View style={dot(12, 8, 1.4)} />
            <View style={seg(12, 11.5, 12, 16.5, w * 1.1)} />
          </>
        );
      case 'help':
        return (
          <>
            <View style={ring(12, 12, 9)} />
            <Text
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: X(4.4),
                textAlign: 'center',
                fontSize: X(11),
                fontWeight: '700',
                color,
                lineHeight: X(14),
              }}>
              ?
            </Text>
          </>
        );
      case 'refresh':
        return (
          <>
            <View
              style={[
                ring(12, 12.5, 7.6, w * 1.2),
                {
                  borderTopColor: 'transparent',
                  transform: [{ rotate: '35deg' }],
                },
              ]}
            />
            <View style={seg(15.6, 2.6, 19.4, 6.2, w * 1.1)} />
            <View style={seg(19.4, 6.2, 15.4, 8.2, w * 1.1)} />
          </>
        );
      case 'chevronRight':
        return (
          <>
            <View style={seg(9.5, 6, 15, 12, w * 1.1)} />
            <View style={seg(15, 12, 9.5, 18, w * 1.1)} />
          </>
        );
      case 'chevronDown':
        return (
          <>
            <View style={seg(6, 9.5, 12, 15, w * 1.1)} />
            <View style={seg(12, 15, 18, 9.5, w * 1.1)} />
          </>
        );
      case 'arrowLeft':
        return (
          <>
            <View style={seg(5.5, 12, 18.5, 12, w * 1.1)} />
            <View style={seg(10.5, 7, 5.5, 12, w * 1.1)} />
            <View style={seg(5.5, 12, 10.5, 17, w * 1.1)} />
          </>
        );
      case 'flash':
        return (
          <>
            <View style={triDown(12.6, 2.5, 4.6, 10.5)} />
            <View style={triUp(11.4, 21.5, 4.6, 10.5)} />
          </>
        );
      case 'swap':
        return (
          <>
            <View style={seg(5, 8.5, 18, 8.5)} />
            <View style={seg(18, 8.5, 14.5, 5.5)} />
            <View style={seg(18, 8.5, 14.5, 11.5)} />
            <View style={seg(19, 15.5, 6, 15.5)} />
            <View style={seg(6, 15.5, 9.5, 12.5)} />
            <View style={seg(6, 15.5, 9.5, 18.5)} />
          </>
        );
      case 'plus':
        return (
          <>
            <View style={seg(12, 5, 12, 19, w * 1.1)} />
            <View style={seg(5, 12, 19, 12, w * 1.1)} />
          </>
        );
      case 'play':
        return <View style={triRight(8.5, 12, 9.5, 6.5)} />;
      case 'pause':
        return (
          <>
            <View style={seg(9.5, 6.5, 9.5, 17.5, w * 1.6)} />
            <View style={seg(14.5, 6.5, 14.5, 17.5, w * 1.6)} />
          </>
        );
      case 'stop':
        return <View style={box(7, 7, 10, 10, 2, true)} />;
      case 'video':
        return (
          <>
            <View style={box(2.5, 7, 13, 10, 3, false)} />
            <View style={seg(15.5, 10.4, 21, 7.2)} />
            <View style={seg(21, 7.2, 21, 16.8)} />
            <View style={seg(21, 16.8, 15.5, 13.6)} />
          </>
        );
      case 'headphones':
        return (
          <>
            <View
              style={{
                position: 'absolute',
                left: X(2.5),
                top: X(3),
                width: X(19),
                height: X(10.5),
                overflow: 'hidden',
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: X(19),
                  height: X(19),
                  borderRadius: X(9.5),
                  borderWidth: w * 1.2,
                  borderColor: color,
                }}
              />
            </View>
            <View style={box(2.2, 12, 4.4, 7.5, 2.2, true)} />
            <View style={box(17.4, 12, 4.4, 7.5, 2.2, true)} />
          </>
        );
      case 'image':
        return (
          <>
            <View style={box(3, 5, 18, 14, 2.5, false)} />
            <View style={dot(8.6, 9.8, 1.5)} />
            <View style={seg(4.5, 17.5, 10, 11.5)} />
            <View style={seg(10, 11.5, 13.5, 15)} />
            <View style={seg(13.5, 15, 16.5, 12)} />
            <View style={seg(16.5, 12, 20, 17.5)} />
          </>
        );
      case 'search':
        return (
          <>
            <View style={ring(10.5, 10.5, 6.5, w * 1.15)} />
            <View style={seg(15.3, 15.3, 20.5, 20.5, w * 1.25)} />
          </>
        );
      case 'record':
        return <View style={dot(12, 12, 5.2)} />;
      case 'signal': {
        const bars: Array<[number, number, number, number]> = [
          [4.5, 15, 4.5, 19],
          [9.5, 12, 9.5, 19],
          [14.5, 9, 14.5, 19],
          [19.5, 6, 19.5, 19],
        ];
        return (
          <>
            {bars.map(([x1, y1, x2, y2], i) => (
              <View
                key={i}
                style={seg(x1, y1, x2, y2, w * 1.5, i < level ? 1 : 0.25)}
              />
            ))}
          </>
        );
      }
      case 'lock':
        return (
          <>
            <View
              style={{
                position: 'absolute',
                left: X(6),
                top: X(3.5),
                width: X(12),
                height: X(9),
                overflow: 'hidden',
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: X(12),
                  height: X(12),
                  borderRadius: X(6),
                  borderWidth: w * 1.1,
                  borderColor: color,
                }}
              />
            </View>
            <View style={box(6.5, 11, 11, 9.5, 2.5, true)} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View
      accessible={false}
      style={{ width: size, height: size, position: 'relative' }}>
      {renderMark()}
    </View>
  );
};
