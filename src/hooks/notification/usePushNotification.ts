import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
} from '@notifee/react-native';
import { useEffect, useState } from 'react';

export function usePushNotification() {
  const [channels, setChannels] = useState({
    quoteChannelId: '',
    legalQuoteChannel: '',
    scheduleChannel: '',
    newsChannel: '',
  });

  useEffect(() => {
    notifee
      .createChannel({
        id: 'quote',
        name: 'Orcamentos',
        importance: AndroidImportance.HIGH,
        sound: 'horn',
        vibration: true,
        visibility: AndroidVisibility.PUBLIC,
      })
      .then((channelId) =>
        setChannels({ ...channels, quoteChannelId: channelId })
      );

    notifee
      .createChannel({
        id: 'legalQuote',
        name: 'Orcamentos',
        importance: AndroidImportance.HIGH,
        sound: 'horn',
        vibration: true,
        visibility: AndroidVisibility.PUBLIC,
      })
      .then((channelId) =>
        setChannels({ ...channels, legalQuoteChannel: channelId })
      );

    notifee
      .createChannel({
        id: 'schedule',
        name: 'Agendamentos',
        importance: AndroidImportance.HIGH,
        sound: 'horn',
        vibration: true,
        visibility: AndroidVisibility.PUBLIC,
      })
      .then((channelId) =>
        setChannels({ ...channels, scheduleChannel: channelId })
      );

    notifee
      .createChannel({
        id: 'news',
        name: 'Noticias',
        importance: AndroidImportance.HIGH,
        sound: 'horn',
        vibration: true,
        visibility: AndroidVisibility.PUBLIC,
      })
      .then((channelId) =>
        setChannels({ ...channels, newsChannel: channelId })
      );

    notifee
      .createChannel({
        id: 'assistance',
        name: 'Assistência',
        importance: AndroidImportance.HIGH,
        sound: 'horn',
        vibration: true,
        visibility: AndroidVisibility.PUBLIC,
      })
      .then((channelId) =>
        setChannels({ ...channels, newsChannel: channelId })
      );
  }, []);

  async function sendNotification(
    title: string,
    body: string,
    channelId: string
  ) {
    try {
      await notifee.requestPermission();

      await notifee.displayNotification({
        id: Math.random().toString(),
        title,
        body,
        android: {
          channelId,
        },
      });
    } catch (error) {
      throw new Error("Couldn't send notification");
    }
  }

  async function cancelNotification(id: string) {
    await notifee.cancelNotification(id);
  }

  async function cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }

  async function scheduleNotifications(
    date: Date,
    channelId: string,
    title: string,
    body: string
  ) {
    await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId,
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
      }
    );
  }

  return {
    channels,
    sendNotification,
    cancelNotification,
    cancelAllNotifications,
    scheduleNotifications,
  };
}

/