import { IPushNotificationDTO } from '@dtos/IPushNotificationDTO';
import { IUserDTO } from '@dtos/IUserDTO';
import { useNotification } from '@hooks/notification/useNotification';
import { usePushNotification } from '@hooks/notification/usePushNotification';
import { useProfile } from '@hooks/useProfile';
import { api } from '@services/api';
import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from '@storage/storageAuthToken';
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser';
import {
  storageUserKeysGet,
  storageUserKeysRemove,
  storageUserKeysSave,
} from '@storage/storageUserKeys';
import { AppError } from '@utils/AppError';
import { createContext, ReactNode, useEffect, useState } from 'react';

export type AuthContextDataProps = {
  user: IUserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  updateUserAuth: (userUpdated: IUserDTO) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { removeProfile } = useProfile();

  const [user, setUser] = useState<IUserDTO>({} as IUserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  const { sendNotification } = usePushNotification();
  const { markAsRead } = useNotification();

  async function userAndTokenUpdate(userData: IUserDTO, token: string) {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setUser(userData);
    } catch (error) {
      throw new AppError('Erro ao atualizar dados do usuário');
    }
  }

  async function storageUserAndTokenSave(
    userData: IUserDTO,
    token: string,
    refresh_token: string
  ) {
    try {
      setIsLoadingUserStorageData(true);
      await storageUserSave(userData);
      await storageAuthTokenSave({ token, refresh_token });

      setIsLoadingUserStorageData(false);
    } catch (error) {
      throw new AppError('Erro ao salvar dados do usuário');
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', {
        email,
        password,
      });

      if (data.user && data.token && data.refresh_token) {
        await storageUserAndTokenSave(
          data.user,
          data.token,
          data.refresh_token
        );
        userAndTokenUpdate(data.user, data.token);
        storageUserKeysSave({
          user_id: data.user.id,
          email: data.user.email,
          password: data.user.password,
        });
      }
    } catch (error) {
      throw new AppError('Usuário ou senha incorretos');
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as IUserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();
      await removeProfile();
      await storageUserKeysRemove();
    } catch (error) {
      console.log(error);
      throw new AppError('Erro ao deslogar usuário');
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserAuth(userUpdated: IUserDTO) {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (error) {
      throw new AppError('Erro ao atualizar dados do usuário');
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const { token } = await storageAuthTokenGet();

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }

      setIsLoadingUserStorageData(false);
    } catch (error) {
      throw new AppError('Erro ao carregar dados do usuário');
    }
  }

  async function notificationsRoutine() {
    const { user_id } = await storageUserKeysGet();
    const { data } = await api.get(`/notifications/all/new`, {
      headers: {
        id: user_id,
      },
    });

    if (data !== undefined) {
      data?.map(async (notification: IPushNotificationDTO) => {
        const notificationId = notification.id;
        if (!notification.received) {
          await markAsRead(user.id, notificationId);
          await sendNotification(
            notification.title,
            notification.body,
            notification.channel
          );
        }
      });
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    };
  }, []);

  useEffect(() => {
    if (user.id !== undefined) {
      const interval = setInterval(async () => {
        notificationsRoutine();
      }, 10000);

      return () => clearInterval(interval);
    }
    return () => {};
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        updateUserAuth,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
