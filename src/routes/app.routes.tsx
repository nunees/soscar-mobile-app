import { FontAwesome, Feather, Entypo } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { AddVehicle } from '@screens/clients/AddVehicle';
import { ChangePassword } from '@screens/clients/ChangePassword';
import { HomeScreen } from '@screens/clients/HomeScreen';
import { PartnerDetails } from '@screens/clients/PartnerDetails';
import { Profile } from '@screens/clients/Profile';
import { Schedules } from '@screens/clients/Schedules';
import { SearchSchedule } from '@screens/clients/SearchSchedule';
import { Services } from '@screens/clients/Services';
import { VehicleDetails } from '@screens/clients/VehicleDetails';
import { Vechicles } from '@screens/clients/Vehicles';
import { Icon, useTheme } from 'native-base';

type AppRotes = {
  home: undefined;
  vehicles: undefined;
  profile: undefined;
  assistance: undefined;
  vehicleDetails: { vehicleId: string };
  addVehicle: undefined;
  changePassword: undefined;
  services: undefined;
  schedules: undefined;
  searchSchedule: { serviceId: string };
  partnerDetails: { partnerId: string };
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRotes>;

const { Screen, Navigator } = createBottomTabNavigator<AppRotes>();

export function AppRoutes() {
  const { colors, fonts } = useTheme();

  const iconSize = 5;

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: fonts.body,
          fontWeight: 'bold',
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
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="home" size={iconSize} color={color} />
          ),
        }}
      />
      <Screen
        name="services"
        component={Services}
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="clipboard" size={iconSize} color={color} />
          ),
        }}
      />

      <Screen
        name="schedules"
        component={Schedules}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="searchSchedule"
        component={SearchSchedule}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="partnerDetails"
        component={PartnerDetails}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="assistance"
        component={Schedules}
        options={{
          title: 'Assistência',
          tabBarIcon: ({ color }) => (
            <Icon as={Entypo} name="lifebuoy" size={iconSize} color={color} />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          title: 'Perfil',
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

      <Screen
        name="changePassword"
        component={ChangePassword}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
