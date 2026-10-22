// __tests__/Bluetooth.test.tsx — deterministic Bluetooth state-transition
// tests with a mocked native bridge. Covers: init rejection surfacing,
// connect rejection clearing `connecting`, and the DeviceScreen
// double-tap guard (one native connect call). These test JS state logic
// only — they do not verify real radio hardware (ST-P0-09).
import React, { useContext } from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  BluetoothContext,
  BluetoothProvider,
} from '../src/state/BluetoothContext';
import DeviceScreen from '../src/screens/DeviceScreen';
import { getBluetoothModule } from '../src/native/modules';

jest.mock('../src/native/modules', () => ({
  __esModule: true,
  getBluetoothModule: jest.fn(),
  nativeCapabilities: { bluetooth: true, camera: false, media: false },
}));

// react-native-safe-area-context renders null children in jest (its native
// inset provider never resolves). Stub it per the library's testing docs.
jest.mock('react-native-safe-area-context', () => {
  const ReactMock = jest.requireActual('react');
  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  return {
    __esModule: true,
    SafeAreaInsetsContext: ReactMock.createContext(insets),
    SafeAreaFrameContext: ReactMock.createContext({
      x: 0,
      y: 0,
      width: 390,
      height: 844,
    }),
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => (
      <ReactMock.Fragment>{children}</ReactMock.Fragment>
    ),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

const mockGetBridge = getBluetoothModule as jest.Mock;

const makeBridge = (overrides: Record<string, any> = {}) => ({
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  getInitialState: jest.fn().mockResolvedValue({ devices: [], state: {} }),
  startScan: jest.fn(),
  stopScan: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  refreshState: jest.fn(),
  ...overrides,
});

const StateProbe = () => {
  const state = useContext(BluetoothContext);
  return (
    <>
      <Text>{`connecting:${String(state.connecting)}`}</Text>
      <Text>{`error:${state.error ?? 'none'}`}</Text>
      <Text>{`devices:${state.devices.map(d => d.name).join(',')}`}</Text>
    </>
  );
};

const renderProvider = async () => {
  let root: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    root = ReactTestRenderer.create(
      <BluetoothProvider>
        <StateProbe />
      </BluetoothProvider>,
    );
  });
  return root!;
};

const textsOf = (root: ReactTestRenderer.ReactTestRenderer): string =>
  root.root
    .findAllByType(Text)
    .map(n => {
      const c = n.props.children;
      return Array.isArray(c) ? c.join('') : String(c ?? '');
    })
    .join('\n');

const Tab = createBottomTabNavigator();

describe('Bluetooth bridge error handling', () => {
  beforeEach(() => {
    mockGetBridge.mockReset();
  });

  test('rejected getInitialState surfaces an error (no unhandled rejection)', async () => {
    mockGetBridge.mockReturnValue(
      makeBridge({ getInitialState: jest.fn().mockRejectedValue(new Error('bt down')) }),
    );
    const texts = textsOf(await renderProvider());
    expect(texts).toMatch('error:Failed to read Bluetooth state');
  });

  test('resolved init loads devices; rejected connect reports and clears connecting', async () => {
    const connect = jest.fn().mockRejectedValue(new Error('refused'));
    mockGetBridge.mockReturnValue(
      makeBridge({
        getInitialState: jest.fn().mockResolvedValue({
          devices: [
            {
              address: 'AA:BB:CC:DD:EE:FF',
              name: 'TestBuds',
              paired: true,
              connected: false,
            },
          ],
          state: {},
        }),
        connect,
      }),
    );
    let root: ReactTestRenderer.ReactTestRenderer | undefined;
    let captured: any;
    const Capture = () => {
      captured = useContext(BluetoothContext);
      return <StateProbe />;
    };
    await ReactTestRenderer.act(async () => {
      root = ReactTestRenderer.create(
        <BluetoothProvider>
          <Capture />
        </BluetoothProvider>,
      );
    });
    expect(textsOf(root!)).toMatch('devices:TestBuds');
    await ReactTestRenderer.act(async () => {
      captured.connectToDevice('AA:BB:CC:DD:EE:FF');
    });
    const texts = textsOf(root!);
    expect(connect).toHaveBeenCalledWith('AA:BB:CC:DD:EE:FF');
    expect(texts).toMatch('connecting:false');
    expect(texts).toMatch('error:refused');
  });

  test('DeviceScreen ignores a second Connect tap while connecting', async () => {
    const connect = jest.fn().mockReturnValue(new Promise(() => {}));
    mockGetBridge.mockReturnValue(
      makeBridge({
        getInitialState: jest.fn().mockResolvedValue({
          devices: [
            {
              address: 'AA:BB:CC:DD:EE:FF',
              name: 'TestBuds',
              paired: false,
              connected: false,
            },
          ],
          state: {},
        }),
        connect,
      }),
    );
    let root: ReactTestRenderer.ReactTestRenderer | undefined;
    await ReactTestRenderer.act(async () => {
      root = ReactTestRenderer.create(
        <BluetoothProvider>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Device" component={DeviceScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </BluetoothProvider>,
      );
    });
    const presses = root!.root.findAllByProps({ accessibilityLabel: 'Connect' });
    expect(presses.length).toBeGreaterThan(0);
    await ReactTestRenderer.act(async () => {
      presses[0].props.onPress();
    });
    await ReactTestRenderer.act(async () => {
      root!.root
        .findAllByProps({ accessibilityLabel: 'Connect' })[0]
        .props.onPress();
    });
    expect(connect).toHaveBeenCalledTimes(1);
  });
});
