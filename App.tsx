import { Loading } from '@components/Loading';
import { AuthContextProvider } from '@contexts/AuthContext';
import { ProfileContextProvider } from '@contexts/UserContext';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Routes } from '@routes/index';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'react-native';

import { THEME } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  return (
    <NativeBaseProvider theme={THEME} isSSR={false}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <AuthContextProvider>
        <ProfileContextProvider>
          {fontsLoaded ? <Routes /> : <Loading />}
        </ProfileContextProvider>
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
