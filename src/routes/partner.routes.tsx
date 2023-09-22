import { Feather, FontAwesome5 } from '@expo/vector-icons';
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
  const { colors } = useTheme();

  const iconSize = 7;

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarActiveTintColor: colors.purple[700],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: '#f5f4f5',
          minHeight: 60,
          borderTopWidth: 0,
          borderTopColor: '#f5f4f5',
        },
      }}
    >
      <Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <Icon as={FontAwesome5} name="home" size={iconSize} color={color} />
          ),
        }}
      />
      <Screen
        name="locations"
        component={Locations}
        options={{
          title: 'Locais',
          tabBarIcon: ({ color }) => (
            <Icon
              as={FontAwesome5}
              name="address-book"
              size={iconSize}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="addLocation"
        component={AddLocation}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />

      <Screen
        name="locationDetails"
        component={LocationDetails}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />

      <Screen
        name="editLocation"
        component={EditLocation}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
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
            <Icon
              as={FontAwesome5}
              name="hands-helping"
              size={iconSize}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Icon
              as={FontAwesome5}
              name="user-circle"
              size={iconSize}
              color={color}
            />
          ),
        }}
      />

      {/* Schedules */}
      <Screen
        name="scheduleDetail"
        component={ScheduleDetail}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Navigator>
  );
}
