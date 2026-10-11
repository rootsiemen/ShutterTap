// App.tsx
import React from 'react';
import { BluetoothProvider } from './src/state/BluetoothContext';
import { AppNavigator } from './src/navigation/BottomTabs';
import { NavigationContainer } from '@react-navigation/native';
import { lightTheme, darkTheme } from './src/theme';
import { useColorScheme } from 'react-native';

const App = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <BluetoothProvider>
      <NavigationContainer theme={theme}>
        <AppNavigator />
      </NavigationContainer>
    </BluetoothProvider>
  );
};

export default App;
