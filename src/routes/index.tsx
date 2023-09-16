import { Loading } from '@components/Loading';
import { useAuth } from '@hooks/useAuth';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AppRoutes } from '@routes/app.routes';
import { AuthRoutes } from '@routes/auth.routes';
import { PartnerRoutes } from '@routes/partner.routes';
import { Box } from 'native-base';
import { LogBox } from 'react-native';

export function Routes() {
  const theme = DefaultTheme;
  // theme.colors.background = '#F0F0F0';
  theme.colors.background = '#FFFFFF';

  const { user, isLoadingUserStorageData } = useAuth();

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message

  return (
    <Box flex={1} bg="white">
      <NavigationContainer theme={theme}>
        {
          // eslint-disable-next-line no-nested-ternary
          !user?.id ? (
            <AuthRoutes />
          ) : user.isPartner ? (
            <PartnerRoutes />
          ) : (
            <AppRoutes />
          )
        }
      </NavigationContainer>
    </Box>
  );
}
