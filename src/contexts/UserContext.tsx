import { IProfileInfoDTO } from '@dtos/IProfileInfoDTO';
import {
  storageUserProfileGet,
  storageUserProfileRemove,
  storageUserProfileSave,
} from '@storage/storageUser';
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
    setIsLoadingProfileStorageData(true);
    await storageUserProfileSave(profileData);
    setIsLoadingProfileStorageData(false);
  }

  async function updateProfile(profileData: IProfileInfoDTO) {
    await saveProfile(profileData);
    setProfile(profileData);
  }

  async function removeProfile() {
    setIsLoadingProfileStorageData(true);
    await storageUserProfileRemove();
    setIsLoadingProfileStorageData(false);
  }

  async function loadProfile() {
    setIsLoadingProfileStorageData(true);
    const profile = await storageUserProfileGet();
    setProfile(profile);
    setIsLoadingProfileStorageData(false);
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
