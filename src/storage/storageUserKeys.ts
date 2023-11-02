import { IKeysDTO } from '@dtos/IKeysDTO';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { USER_KEYS } from './storageConfig';

export async function storageUserKeysSave(key: IKeysDTO) {
  await AsyncStorage.setItem(USER_KEYS, JSON.stringify(key));
}

export async function storageUserKeysGet() {
  const response = await AsyncStorage.getItem(USER_KEYS);
  const key: IKeysDTO = response ? JSON.parse(response) : {};
  return key;
}

export async function storageUserKeysRemove() {
  await AsyncStorage.removeItem(USER_KEYS);
}
