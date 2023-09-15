import { IUserDTO } from '@dtos/IUserDTO';
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

  async function userAndTokenUpdate(userData: IUserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    setUser(userData);
  }

  async function storageUserAndTokenSave(
    userData: IUserDTO,
    token: string,
    refresh_token: string
  ) {
    setIsLoadingUserStorageData(true);
    await storageUserSave(userData);
    await storageAuthTokenSave({ token, refresh_token });

    setIsLoadingUserStorageData(false);
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
      }
    } catch (error) {
      throw new AppError('Erro ao autenticar usuário');
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
    } catch (error) {
      throw new AppError('Erro ao deslogar usuário');
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserAuth(userUpdated: IUserDTO) {
    setUser(userUpdated);
    await storageUserSave(userUpdated);
  }

  async function loadUserData() {
    setIsLoadingUserStorageData(true);

    const userLogged = await storageUserGet();
    const { token } = await storageAuthTokenGet();

    if (token && userLogged) {
      userAndTokenUpdate(userLogged, token);
    }

    setIsLoadingUserStorageData(false);
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
