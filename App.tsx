// App.tsx
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BluetoothProvider } from './src/state/BluetoothContext';
import { AppNavigator } from './src/navigation/BottomTabs';
import { NavigationContainer } from '@react-navigation/native';
import { lightTheme, darkTheme } from './src/theme';

const App = () => {
  const scheme = useColorScheme();
  const dark = scheme !== 'light';
  const theme = dark ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        translucent={false}
      />
      <BluetoothProvider>
        <NavigationContainer theme={theme}>
          <AppNavigator />
        </NavigationContainer>
      </BluetoothProvider>
    </SafeAreaProvider>
  );
};

export default App;
