/* eslint-disable import/no-extraneous-dependencies */
import * as BackgroundFetch from 'expo-background-fetch';

export function useCreateBackgroundProcess(taskName: string) {
  async function registerBackgroundFetchAsync() {
    console.log('registerBackgroundFetchAsync');
    return BackgroundFetch.registerTaskAsync(taskName, {
      minimumInterval: 1 * 60, // 1 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: false, // android only
    });
  }

  async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(taskName);
  }

  return { registerBackgroundFetchAsync, unregisterBackgroundFetchAsync };
}
