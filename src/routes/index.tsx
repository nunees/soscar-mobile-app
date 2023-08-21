import { useContext } from "react";
import { Box, useTheme } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useAuth } from "@hooks/useAuth";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { PartnerRoutes } from "./partner.routes";
import { Loading } from "@components/Loading";

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
        {!user?.id ? (
          <AuthRoutes />
        ) : user.isPartner ? (
          <PartnerRoutes />
        ) : (
          <AppRoutes />
        )}
      </NavigationContainer>
    </Box>
  );
}
