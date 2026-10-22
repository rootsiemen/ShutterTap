// src/native/modules.ts — undefined-safe access to planned native bridges.
//
// All JS callers must go through these getters instead of destructuring
// NativeModules inline. Until ST-P0-07 / ST-P3-01 land, every getter
// returns undefined and callers render explicit "unavailable" states
// (never fake data, never a TypeError from property access on undefined).

import { NativeModules } from 'react-native';

// Untyped native bridge handles. `any` is deliberate: these are dynamic
// Java/Kotlin + Objective-C bridges with no shared type definition, and
// every consumer uses optional chaining, so no method call can throw on
// a missing bridge.
type NativeModule = any;

const read = (name: string): NativeModule => {
  const modules = NativeModules as Record<string, any> | undefined;
  const mod = modules?.[name];
  return mod ?? undefined;
};

export const getBluetoothModule = (): NativeModule =>
  read('BluetoothModule');

export const getCameraModule = (): NativeModule => read('CameraModule');

export const getMediaButtonModule = (): NativeModule =>
  read('MediaButtonModule');

export const nativeCapabilities = {
  get bluetooth(): boolean {
    return getBluetoothModule() != null;
  },
  get camera(): boolean {
    return getCameraModule() != null;
  },
  get media(): boolean {
    return getMediaButtonModule() != null;
  },
};
