/* eslint-disable import/no-extraneous-dependencies */
import { Loading } from '@components/Loading';
import { AuthContextProvider } from '@contexts/AuthContext';
import { ProfileContextProvider } from '@contexts/UserContext';
import { IPushNotificationDTO } from '@dtos/IPushNotificationDTO';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { useNotification } from '@hooks/notification/useNotification';
import { usePushNotification } from '@hooks/notification/usePushNotification';
import notifee, { EventType } from '@notifee/react-native';
import { Routes } from '@routes/index';
import { storageUserKeysGet } from '@storage/storageUserKeys';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { THEME } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });
  const [state] = useState<IPushNotificationDTO[]>([]);

  const { sendNotification } = usePushNotification();
  const { markAsRead } = useNotification();

  async function triggerNotification() {
    try {
      console.log("I'm running foreground task");
      const { user_id } = await storageUserKeysGet();
      if (state !== undefined) {
        state.map(async (notification: IPushNotificationDTO) => {
          const notificationId = notification.id;
          if (!notification.received) {
            await sendNotification(
              notification.title,
              notification.body,
              notification.channel
            );
            await markAsRead(user_id, notificationId);
          }
        });
      }
    } catch (error) {
      throw new Error('Erro ao carregar notificações');
    }
  }

  useEffect(() => {
    triggerNotification();
  }, []);

  // Background notification event
  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('Background event received. Type: ', type);
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          console.log('User dismissed notification action', type);
          break;
        case EventType.PRESS:
          console.log('User pressed notification action button', detail);
          break;
        default:
          break;
      }
    });
  }, []);

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
