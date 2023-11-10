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
import { api } from '@services/api';
import { storageUserKeysGet } from '@storage/storageUserKeys';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { NativeBaseProvider } from 'native-base';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { THEME } from './src/theme';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

let setStateFn: Dispatch<SetStateAction<IPushNotificationDTO[]>> = () => {
  console.log('State not yet initialized');
};

async function notificationTask() {
  try {
    const { user_id } = await storageUserKeysGet();
    const result = await api.get('/notifications/all/new', {
      headers: {
        id: user_id,
      },
    });
    setStateFn(result.data);
    return result.data
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const result = await notificationTask();
    return result;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

async function initBackgroundFetch(
  taskName: string,
  taskfn: {
    (): Promise<BackgroundFetch.BackgroundFetchResult>;
    (body: TaskManager.TaskManagerTaskBody<object>): void;
  },
  interval = 60 * 1
) {
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
      TaskManager.defineTask(taskName, taskfn);
    }
    const options = {
      minimumInterval: interval,
    };
    await BackgroundFetch.registerTaskAsync(taskName, options);
  } catch (error) {
    console.log('registerTaskAsyn failed: ', error);
  }
}

initBackgroundFetch(BACKGROUND_FETCH_TASK, notificationTask, 1);

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });
  const [state, setState] = useState<IPushNotificationDTO[]>([]);

  const { sendNotification } = usePushNotification();
  const { markAsRead } = useNotification();

  setStateFn = setState;

  async function triggerNotification() {
    try {
      console.log('Calling triggerNotification');
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

  // useEffect(() => {
  //   try {
  //     BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
  //       minimumInterval: 60, // seconds,
  //     });
  //     console.log('Task registered');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

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
