// src/state/BluetoothContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { BluetoothDevice } from '../types/models';

// Native module bridge (will be implemented in Kotlin)
const { BluetoothModule } = NativeModules as any;
const bluetoothEmitter = BluetoothModule ? new NativeEventEmitter(BluetoothModule) : null;

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
    BluetoothModule?.getInitialState?.().then((init: any) => {
      // Guard against unexpected shape
      if (init && typeof init === 'object') {
        const { devices = [], state: innerState = {} } = init;
        setState(prev => ({
          ...prev,
          devices,
          ...innerState,
        }));
      }
    });
    return () => {
      devicesSub?.remove();
      stateSub?.remove();
    };
  }, []);

  const startScan = () => {
    BluetoothModule?.startScan?.();
    setState(prev => ({ ...prev, scanning: true }));
  };
  const stopScan = () => {
    BluetoothModule?.stopScan?.();
    setState(prev => ({ ...prev, scanning: false }));
  };
  const connectToDevice = (address: string) => {
    // Indicate connecting state
    setState(prev => ({ ...prev, connecting: true }));
    const promise = BluetoothModule?.connect?.(address);
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
    BluetoothModule?.refreshState?.();
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
