import { IProfileInfoDTO } from '@dtos/IProfileInfoDTO';
import { IUserDTO } from '@dtos/IUserDTO';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { USER_STORAGE, USER_PROFILE_STORAGE } from './storageConfig';

// User auth
export async function storageUserSave(user: IUserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserGet() {
  const response = await AsyncStorage.getItem(USER_STORAGE);
  const user: IUserDTO = response ? JSON.parse(response) : {};
  return user;
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE);
}

// User profile
export async function storageUserProfileSave(profile: IProfileInfoDTO) {
  await AsyncStorage.setItem(USER_PROFILE_STORAGE, JSON.stringify(profile));
}

export async function storageUserProfileGet() {
  const response = await AsyncStorage.getItem(USER_PROFILE_STORAGE);
  const profile: IProfileInfoDTO = response ? JSON.parse(response) : {};
  return profile;
}

export async function storageUserProfileRemove() {
  await AsyncStorage.removeItem(USER_PROFILE_STORAGE);
}
