import { Loading } from '@components/Loading';
import { AuthContextProvider } from '@contexts/AuthContext';
import { ProfileContextProvider } from '@contexts/UserContext';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { Routes } from '@routes/index';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'react-native';

import { THEME } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  // async function bootstrap() {
  //   const initialNotification = await notifee.getInitialNotification();
  //   if (initialNotification) {
  //     console.log(
  //       'Notification caused application to open',
  //       initialNotification.notification
  //     );
  //     console.log(
  //       'Press action used to open the app',
  //       initialNotification.pressAction
  //     );
  //   }
  // }

  // useEffect(() => {
  //   bootstrap()
  //     .then(() => setLoading(false))
  //     .catch((err) => console.log(err));
  // }, []);

  // useEffect(() => {
  //   return notifee.onBackgroundEvent(async ({ type, detail }) => {
  //     switch (type) {
  //       case EventType.DISMISSED:
  //         console.log('User dismissed notification', detail.notification);
  //         break;
  //       case EventType.PRESS:
  //         console.log('User pressed notification action button', detail);
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  // }, []);

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="light-content" backgroundColor="#340554" />
      <AuthContextProvider>
        <ProfileContextProvider>
          {fontsLoaded ? <Routes /> : <Loading />}
        </ProfileContextProvider>
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
