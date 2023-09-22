import { IProfileInfoDTO } from '@dtos/IProfileInfoDTO';
import {
  storageUserProfileGet,
  storageUserProfileRemove,
  storageUserProfileSave,
} from '@storage/storageUser';
import { AppError } from '@utils/AppError';
import { ReactNode, createContext, useEffect, useState } from 'react';

export type ProfileContextDataProps = {
  profile: IProfileInfoDTO;
  updateProfile: (profileData: IProfileInfoDTO) => Promise<void>;
  removeProfile: () => Promise<void>;
  saveProfile: (profileData: IProfileInfoDTO) => Promise<void>;
  isLoadingProfileStorageData: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const ProfileContext = createContext<ProfileContextDataProps>(
  {} as ProfileContextDataProps
);

export function ProfileContextProvider({ children }: AuthContextProviderProps) {
  const [profile, setProfile] = useState<IProfileInfoDTO>(
    {} as IProfileInfoDTO
  );

  const [isLoadingProfileStorageData, setIsLoadingProfileStorageData] =
    useState(true);

  async function saveProfile(profileData: IProfileInfoDTO) {
    try {
      setIsLoadingProfileStorageData(true);
      await storageUserProfileSave(profileData);
      setIsLoadingProfileStorageData(false);
    } catch (error) {
      throw new AppError('Erro ao salvar perfil');
    }
  }

  async function updateProfile(profileData: IProfileInfoDTO) {
    try {
      await saveProfile(profileData);
      setProfile(profileData);
    } catch (error) {
      throw new AppError('Erro ao atualizar perfil');
    }
  }

  async function removeProfile() {
    try {
      await storageUserProfileRemove();
    } catch (error) {
      throw new AppError('Erro ao remover perfil');
    }
  }

  async function loadProfile() {
    try {
      setIsLoadingProfileStorageData(true);
      const profile = await storageUserProfileGet();
      setProfile(profile);
      setIsLoadingProfileStorageData(false);
    } catch (error) {
      throw new AppError('Erro ao carregar perfil');
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        saveProfile,
        removeProfile,
        updateProfile,
        isLoadingProfileStorageData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
