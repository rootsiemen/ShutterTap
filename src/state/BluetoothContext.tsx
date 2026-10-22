// src/state/BluetoothContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { NativeEventEmitter } from 'react-native';
import { BluetoothDevice } from '../types/models';
import { getBluetoothModule } from '../native/modules';

// Native module bridge (implemented natively per ST-P0-07; until then the
// getter below resolves to undefined and every call degrades safely).
const bluetoothModule = getBluetoothModule();
const bluetoothEmitter = bluetoothModule
  ? new NativeEventEmitter(bluetoothModule)
  : null;

interface BluetoothState {
  devices: BluetoothDevice[];
  scanning: boolean;
  connectedDevice?: BluetoothDevice;
  error?: string;
  connecting?: boolean;
}

interface BluetoothContextProps extends BluetoothState {
  startScan: () => void;
  stopScan: () => void;
  connectToDevice: (address: string) => void;
  refreshState: () => void;
}

const defaultState: BluetoothState = {
  devices: [],
  scanning: false,
  connecting: false,
};

export const BluetoothContext = createContext<BluetoothContextProps>({
  ...defaultState,
  startScan: () => {},
  stopScan: () => {},
  connectToDevice: () => {},
  refreshState: () => {},
});

export const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<BluetoothState>(defaultState);

  // Event listeners from native side
  useEffect(() => {
    const devicesSub = bluetoothEmitter?.addListener('onDevicesChanged', (devices: any) => {
      setState(prev => ({ ...prev, devices }));
    });
    const stateSub = bluetoothEmitter?.addListener('onStateChanged', (newState: any) => {
      // Merge the new state fields (e.g., scanning, connectedDevice) into our context state
      setState(prev => ({ ...prev, ...newState }));
    });
    // initial fetch – the native method returns an object { devices: [], state: { scanning: false, ... } }
    // A rejection means a present-but-broken bridge: surface it instead of
    // leaving an unhandled promise rejection. (When no bridge exists the
    // optional chain above short-circuits and neither callback runs.)
    getBluetoothModule()
      ?.getInitialState?.()
      .then(
        (init: any) => {
          // Guard against unexpected shape
          if (init && typeof init === 'object') {
            const { devices = [], state: innerState = {} } = init;
            setState(prev => ({
              ...prev,
              devices,
              ...innerState,
            }));
          }
        },
        () => {
          setState(prev => ({
            ...prev,
            error: 'Failed to read Bluetooth state',
          }));
        },
      );
    return () => {
      devicesSub?.remove();
      stateSub?.remove();
    };
  }, []);

  const startScan = () => {
    getBluetoothModule()?.startScan?.();
    setState(prev => ({ ...prev, scanning: true }));
  };
  const stopScan = () => {
    getBluetoothModule()?.stopScan?.();
    setState(prev => ({ ...prev, scanning: false }));
  };
  const connectToDevice = (address: string) => {
    // A new attempt supersedes any previous error.
    setState(prev => ({ ...prev, connecting: true, error: undefined }));
    const promise = getBluetoothModule()?.connect?.(address);
    if (promise && typeof promise.then === 'function') {
        promise
            .then(() => {
                setState(prev => ({ ...prev, connecting: false, error: undefined }));
            })
            .catch((err: any) => {
                const message = err?.message || (typeof err === 'string' ? err : 'Connection failed');
                setState(prev => ({ ...prev, connecting: false, error: message }));
            });
    } else {
        // No promise returned, clear connecting flag
        setState(prev => ({ ...prev, connecting: false }));
    }
  };
  const refreshState = () => {
    getBluetoothModule()?.refreshState?.();
  };

  return (
    <BluetoothContext.Provider
      value={{
        ...state,
        startScan,
        stopScan,
        connectToDevice,
        refreshState,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
