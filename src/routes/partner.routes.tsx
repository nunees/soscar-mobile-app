import { Feather } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { Profile } from '@screens/clients/Profile';
import { AddLocation } from '@screens/partners/AddLocation';
import { EditLocation } from '@screens/partners/EditLocation';
import { HomeScreen } from '@screens/partners/HomeScreen';
import { LocationDetails } from '@screens/partners/LocationDetails';
import { Locations } from '@screens/partners/Locations';
import { Icon, useTheme } from 'native-base';

type PartnerRoutes = {
  home: undefined;
  profile: undefined;
  locations: undefined;
  addLocation: undefined;
  locationDetails: { locationId: string };
  editLocation: { locationId: string };
};

export type PartnerNavigatorRoutesProps =
  BottomTabNavigationProp<PartnerRoutes>;

const { Screen, Navigator } = createBottomTabNavigator<PartnerRoutes>();

export function PartnerRoutes() {
  const { colors, fonts } = useTheme();

  const iconSize = 8;

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
          paddingBottom: 10,
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
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="home" size={iconSize} color={color} />
          ),
        }}
      />

      <Screen
        name="locations"
        component={Locations}
        options={{
          title: 'Locais',
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="map-pin" size={iconSize} color={color} />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="user" size={iconSize} color={color} />
          ),
        }}
      />

      <Screen
        name="addLocation"
        component={AddLocation}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="locationDetails"
        component={LocationDetails}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="editLocation"
        component={EditLocation}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
