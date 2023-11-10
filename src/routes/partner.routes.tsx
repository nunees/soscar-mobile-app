import { FontAwesome5 } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { ChangePassword } from '@screens/ChangePassword';
import EditProfileInformation from '@screens/EditProfileInformation';
import MyAccountInformation from '@screens/MyAccountInformation';
import { Notifications } from '@screens/Notifications';
import { Assistance } from '@screens/partners/Assistance';
import { AssistanceMap } from '@screens/partners/assistance/AssistanceMap';
import { HomeScreen } from '@screens/partners/HomeScreen';
import { AddLocation } from '@screens/partners/locations/AddLocation';
import { EditLocation } from '@screens/partners/locations/EditLocation';
import { LocationDetails } from '@screens/partners/locations/LocationDetails';
import { Locations } from '@screens/partners/locations/Locations';
import { Orders } from '@screens/partners/Orders';
import { LegalQuoteDetail } from '@screens/partners/quotes/LegalQuoteDetail';
import { QuoteDetail } from '@screens/partners/quotes/QuoteDetail';
import { ScheduleDetail } from '@screens/partners/schedules/ScheduleDetail';
import { Profile } from '@screens/Profile';
import { ValidateDocument } from '@screens/ValidateDocument';
import { Icon, useTheme } from 'native-base';

type PartnerRoutes = {
  home: undefined;
  profile: undefined;
  myaccountInformation: undefined;
  editProfileInformation: undefined;
  changePassword: undefined;
  locations: undefined;
  orders: undefined;
  assistance: undefined;
  addLocation: undefined;
  locationDetails: { locationId: string };
  editLocation: { locationId: string };
  scheduleDetail: { scheduleId: string };
  quoteDetail: { quoteId: string; locationId: string };
  legalQuoteDetail: { legalQuoteId: string; locationId: string };
  validateDocument: undefined;
  notifications: undefined;
  assistanceMap: undefined;
};

export type PartnerNavigatorRoutesProps =
  BottomTabNavigationProp<PartnerRoutes>;

const { Screen, Navigator } = createBottomTabNavigator<PartnerRoutes>();

export function PartnerRoutes() {
  const { colors, fonts } = useTheme();

  const iconSize = 7;

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.purple[700],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          paddingBottom: 5,
          backgroundColor: '#f5f4f5',
          minHeight: 60,
          borderTopWidth: 0,
          borderTopColor: '#f5f4f5',
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body,
          fontWeight: 'bold',
          fontSize: 12,
          marginTop: -5,
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
        name="orders"
        component={Orders}
        options={{
          title: 'Ordens',
          tabBarIcon: ({ color }) => (
            <Icon
              as={FontAwesome5}
              name="clipboard-list"
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
          title: 'Assistência',
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

      <Screen
        name="myaccountInformation"
        component={MyAccountInformation}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />

      <Screen
        name="editProfileInformation"
        component={EditProfileInformation}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />

      <Screen
        name="changePassword"
        component={ChangePassword}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
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

      <Screen
        name="quoteDetail"
        component={QuoteDetail}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="legalQuoteDetail"
        component={LegalQuoteDetail}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="validateDocument"
        component={ValidateDocument}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="notifications"
        component={Notifications}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="assistanceMap"
        component={AssistanceMap}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Navigator>
  );
}
