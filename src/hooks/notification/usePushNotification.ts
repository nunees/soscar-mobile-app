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
      console.log(error);
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

// async function updateNotification() {
//   await notifee.requestPermission();

//   const channelId = await notifee.createChannel({
//     id: 'default',
//     name: 'Test',
//     vibration: true,
//     importance: AndroidImportance.HIGH,
//   });

//   await notifee.displayNotification({
//     id: '1',
//     title: 'My notification title',
//     body: 'My notification body',
//     android: {
//       channelId,
//     },
//   });
// }

// async function displayNotification() {
//   await notifee.requestPermission();

//   const channelId = await notifee.createChannel({
//     id: 'default',
//     name: 'Test',
//     vibration: true,
//     importance: AndroidImportance.HIGH,
//   });

//   await notifee.displayNotification({
//     id: '1',
//     title: 'My notification title',
//     body: 'My notification body',
//     android: {
//       channelId,
//     },
//   });
// }

// async function cancelNotification() {
//   await notifee.cancelNotification('1');
// }

// async function scheduledNotification() {
//   const date = new Date(Date.now());
//   date.setMinutes(date.getMinutes() + 1);

//   const trigger: TimestampTrigger = {
//     type: TriggerType.TIMESTAMP,
//     timestamp: date.getTime(),
//   };

//   await notifee.createTriggerNotification(
//     {
//       title: 'My notification title',
//       body: 'My notification body',
//       android: {
//         channelId: 'test',
//       },
//     },
//     trigger
//   );
// }

// async function listScheduledNotifications() {
//   notifee.getTriggerNotificationIds().then((ids) => {
//     console.log(ids);
//   });
// }

// useEffect(() => {
//   return notifee.onForegroundEvent(({ type, detail }) => {
//     switch (type) {
//       case EventType.DISMISSED:
//         console.log('User dismissed notification', detail.notification);
//         break;
//       case EventType.ACTION_PRESS:
//         console.log('User pressed notification action button', detail);
//         break;
//       default:
//         break;
//     }
//   });
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

// useEffect(() => {
//   displayNotification();
// }, []);
