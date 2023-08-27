import { Loading } from '@components/Loading';
import { useAuth } from '@hooks/useAuth';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AppRoutes } from '@routes/app.routes';
import { AuthRoutes } from '@routes/auth.routes';
import { PartnerRoutes } from '@routes/partner.routes';
import { Box, useTheme } from 'native-base';

export function Routes() {
  const { colors } = useTheme();
  const theme = DefaultTheme;
  theme.colors.background = colors.white;

  const { user, isLoadingUserStorageData } = useAuth();

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

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
