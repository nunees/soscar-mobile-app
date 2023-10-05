import { Loading } from '@components/Loading';
import { AuthContextProvider } from '@contexts/AuthContext';
import { ProfileContextProvider } from '@contexts/UserContext';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { Routes } from '@routes/index';
import * as Location from 'expo-location';
import { NativeBaseProvider } from 'native-base';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

import { THEME } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_700Bold });

  return (
    <NativeBaseProvider theme={THEME} isSSR={false}>
      <StatusBar barStyle="light-content" backgroundColor="#340554" />
      <AuthContextProvider>
        <ProfileContextProvider>
          {fontsLoaded ? <Routes /> : <Loading />}
        </ProfileContextProvider>
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
