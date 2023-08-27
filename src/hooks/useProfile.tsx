import { ProfileContext } from '@contexts/UserContext';
import { useContext } from 'react';

export function useProfile() {
  const context = useContext(ProfileContext);
  return context;
}
