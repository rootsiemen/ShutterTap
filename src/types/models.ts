// src/types/models.ts

/**
 * Represents a Bluetooth device discovered or paired on Android.
 * Shape agreed with the planned native port (ST-P0-07): port the EarShot
 * reference model under the `com.anonymous.shuttertap.*` namespace
 * (matching applicationId) emitting exactly these fields.
 */
export interface BluetoothDevice {
  address: string;
  name: string;
  paired: boolean;
  connected: boolean;
  rssi?: number;
}

/** Gesture types detected from earbud button presses */
export enum GestureType {
  SINGLE_TAP = 'SINGLE_TAP',
  DOUBLE_TAP = 'DOUBLE_TAP',
  TRIPLE_TAP = 'TRIPLE_TAP',
  LONG_PRESS = 'LONG_PRESS',
}

/** Camera actions that can be mapped to gestures */
export enum CameraAction {
  NONE = 'NONE',
  TAKE_PHOTO = 'TAKE_PHOTO',
  START_VIDEO = 'START_VIDEO',
  STOP_VIDEO = 'STOP_VIDEO',
  SWITCH_CAMERA = 'SWITCH_CAMERA',
  TOGGLE_FLASH = 'TOGGLE_FLASH',
}

/** Mapping between a gesture and a camera action */
export interface GestureMapping {
  gestureType: GestureType;
  cameraAction: CameraAction;
}

/** Media button events from Bluetooth earbuds */
export enum MediaButtonType {
  PLAY_PAUSE = 'PLAY_PAUSE',
  NEXT_TRACK = 'NEXT_TRACK',
  PREVIOUS_TRACK = 'PREVIOUS_TRACK',
  UNKNOWN = 'UNKNOWN',
}

export interface MediaButtonEvent {
  eventType: MediaButtonType;
  timestamp: number; // epoch ms
}
