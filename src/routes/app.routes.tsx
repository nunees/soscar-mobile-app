import { Platform } from "react-native";
import { Icon, Text, useTheme } from "native-base";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import { HomeScreen } from "@screens/clients/HomeScreen";
import { FontAwesome, Feather, Entypo } from "@expo/vector-icons";
import { Vechicles } from "@screens/clients/Vehicles";
import { Profile } from "@screens/clients/Profile";
import { Schedules } from "@screens/clients/Schedules";
import { VehicleDetails } from "@screens/clients/VehicleDetails";
import { AddVehicle } from "@screens/clients/AddVehicle";

type AppRotes = {
  home: undefined;
  vehicles: undefined;
  profile: undefined;
  schedules: undefined;
  assistance: undefined;
  vehicleDetails: { vehicleId: string };
  addVehicle: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRotes>;

const { Screen, Navigator } = createBottomTabNavigator<AppRotes>();

export function AppRoutes() {
  const { sizes, colors, fonts } = useTheme();

  const iconSize = 5;

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: fonts.body,
          fontWeight: "bold",
          paddingBottom: 20,
        },
        tabBarActiveTintColor: colors.orange[700],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          minHeight: 70,
        },
      }}
    >
      <Screen
        name="home"
        component={HomeScreen}
        navigationKey="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="home" size={iconSize} color={color} />
          ),
        }}
      />
      <Screen
        name="schedules"
        component={Schedules}
        options={{
          title: "Agendamentos",
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="calendar" size={iconSize} color={color} />
          ),
        }}
      />

      <Screen
        name="assistance"
        component={Schedules}
        options={{
          title: "Assistência",
          tabBarIcon: ({ color }) => (
            <Icon as={Entypo} name="lifebuoy" size={iconSize} color={color} />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Icon as={FontAwesome} name="user" size={iconSize} color={color} />
          ),
        }}
      />

      <Screen
        name="vehicles"
        component={Vechicles}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="vehicleDetails"
        component={VehicleDetails}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="addVehicle"
        component={AddVehicle}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
