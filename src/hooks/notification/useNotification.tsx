import { api } from '@services/api';
import { useState } from 'react';

export function useNotification() {
  const [state, setState] = useState({
    data: null,
    errror: '',
    isLoading: false,
    isError: false,
    isSucess: false,
  });

  async function sendNotification(
    user_id: string,
    body: string,
    auth_id: string
  ) {
    try {
      setState({
        ...state,
        isLoading: true,
      });

      await api.post(
        '/notifications',
        {
          user_id,
          body,
        },
        {
          headers: {
            id: auth_id,
          },
        }
      );

      setState({
        ...state,
        data: null,
        isLoading: false,
        isError: false,
        isSucess: true,
      });
    } catch (error) {
      setState({
        ...state,
        data: null,
        isLoading: false,
        isError: true,
        isSucess: false,
      });
    }
  }

  async function fetchNotifications(auth_id: string, user_id: string) {
    try {
      setState({
        ...state,
        isLoading: true,
      });

      const { data } = await api.get(`/notifications/user/${user_id}`, {
        headers: {
          id: auth_id,
        },
      });

      setState({
        ...state,
        data,
        isLoading: false,
        isError: false,
        isSucess: true,
      });
    } catch (error) {
      setState({
        ...state,
        data: null,
        isLoading: false,
        isError: true,
        isSucess: false,
      });
    }
  }

  async function markAsRead(auth_id: string, notification_id: string) {
    try {
      setState({
        ...state,
        isLoading: true,
      });

      await api.patch(
        `/notifications/${notification_id}`,
        {},
        {
          headers: {
            id: auth_id,
          },
        }
      );

      setState({
        ...state,
        isLoading: false,
        isError: false,
        isSucess: true,
      });
    } catch (error) {
      setState({
        ...state,
        data: null,
        isLoading: false,
        isError: true,
        isSucess: false,
      });
    }
  }

  async function deleteNotification(auth_id: string, notification_id: string) {
    try {
      setState({
        ...state,
        isLoading: true,
      });

      await api.delete(`/notifications/${notification_id}`, {
        headers: {
          id: auth_id,
        },
      });

      setState({
        ...state,
        isLoading: false,
        isError: false,
        isSucess: true,
      });
    } catch (error) {
      setState({
        ...state,
        data: null,
        isLoading: false,
        isError: true,
        isSucess: false,
      });
    }
  }

  async function fetchSingleNotification(
    auth_id: string,
    notification_id: string
  ) {
    try {
      setState({
        ...state,
        isLoading: true,
      });

      const { data } = await api.get(`/notifications/${notification_id}`, {
        headers: {
          id: auth_id,
        },
      });

      setState({
        ...state,
        data,
        isLoading: false,
        isError: false,
        isSucess: true,
      });
    } catch (error) {
      setState({
        ...state,
        data: null,
        isLoading: false,
        isError: true,
        isSucess: false,
      });
    }
  }

  async function deleteAllUserNotifications(auth_id: string, user_id: string) {
    try {
      setState({
        ...state,
        isLoading: true,
      });

      await api.delete(`/notifications/all/${user_id}`, {
        headers: {
          id: auth_id,
        },
      });

      setState({
        ...state,
        isLoading: false,
        isError: false,
        isSucess: true,
      });
    } catch (error) {
      setState({
        ...state,
        data: null,
        isLoading: false,
        isError: true,
        isSucess: false,
      });
    }
  }

  return {
    state,
    sendNotification,
    fetchNotifications,
    deleteNotification,
    fetchSingleNotification,
    deleteAllUserNotifications,
    markAsRead,
  };
}
