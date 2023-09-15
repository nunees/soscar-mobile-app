import { Feather } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { Assistance } from '@screens/partners/Assistance';
import { HomeScreen } from '@screens/partners/HomeScreen';
import { AddLocation } from '@screens/partners/locations/AddLocation';
import { EditLocation } from '@screens/partners/locations/EditLocation';
import { LocationDetails } from '@screens/partners/locations/LocationDetails';
import { Locations } from '@screens/partners/locations/Locations';
import { Messaging } from '@screens/partners/Messaging';
import { Profile } from '@screens/partners/Profile';
import { ScheduleDetail } from '@screens/partners/schedules/ScheduleDetail';
import { Icon, useTheme } from 'native-base';

type PartnerRoutes = {
  home: undefined;
  profile: undefined;
  locations: undefined;
  messaging: undefined;
  assistance: undefined;
  addLocation: undefined;
  locationDetails: { locationId: string };
  editLocation: { locationId: string };
  scheduleDetail: { scheduleId: string };
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

      <Screen
        name="messaging"
        component={Messaging}
        options={{
          title: 'Mensagens',
          tabBarIcon: ({ color }) => (
            <Icon
              as={Feather}
              name="message-square"
              size={iconSize}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="assistance"
        component={Assistance}
        options={{
          title: 'Assistencia',
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="life-buoy" size={iconSize} color={color} />
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

      {/* Schedules */}
      <Screen
        name="scheduleDetail"
        component={ScheduleDetail}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
