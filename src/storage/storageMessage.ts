import AsyncStorage from '@react-native-async-storage/async-storage';

import { MESSAGES_STORAGE } from './storageConfig';

type storageMessageProps = {
  sender_id: string;
  sender_avatar: string;
  receiver_id: string;
  receiver_avatar: string;
  content: string;
  status: number;
  created_at: Date;
};

export async function storageMessageSave({
  sender_id,
  sender_avatar,
  receiver_id,
  receiver_avatar,
  content,
  status,
  created_at,
}: storageMessageProps) {
  await AsyncStorage.setItem(
    MESSAGES_STORAGE,
    JSON.stringify({
      sender_id,
      sender_avatar,
      receiver_id,
      receiver_avatar,
      content,
      status,
      created_at,
    })
  );
}

export async function storageMessageGet() {
  const response = await AsyncStorage.getItem(MESSAGES_STORAGE);

  const {
    sender_id,
    sender_avatar,
    receiver_id,
    receiver_avatar,
    content,
    status,
    created_at,
  }: storageMessageProps = response ? JSON.parse(response) : {};

  return {
    sender_id,
    sender_avatar,
    receiver_id,
    receiver_avatar,
    content,
    status,
    created_at,
  };
}

export async function storageMessageRemove() {
  AsyncStorage.removeItem(MESSAGES_STORAGE);
}
