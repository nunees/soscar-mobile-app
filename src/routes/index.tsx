import { Loading } from '@components/Loading';
import { useAuth } from '@hooks/useAuth';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AppRoutes } from '@routes/app.routes';
import { AuthRoutes } from '@routes/auth.routes';
import { PartnerRoutes } from '@routes/partner.routes';
import { Box, useTheme } from 'native-base';

export function Routes() {
  const theme = DefaultTheme;

  const { colors } = useTheme();

  // eslint-disable-next-line prefer-destructuring
  theme.colors.background = colors.gray[100];
  const { user, isLoadingUserStorageData } = useAuth();

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg="white">
      <NavigationContainer theme={theme}>
        {/* {
          // eslint-disable-next-line no-nested-ternary
          !user?.id ? (
            <AuthRoutes />
          ) : user.isPartner ? (
            <PartnerRoutes />
          ) : (
            <AppRoutes />
          )
        } */}
        {!user.id && <AuthRoutes />}
        {user.id && !user.isPartner && <AppRoutes />}
        {user.id && user.isPartner && <PartnerRoutes />}
      </NavigationContainer>
    </Box>
  );
}
