import { FontAwesome, Feather, Entypo } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { ChangePassword } from '@screens/clients/ChangePassword';
import { HomeScreen } from '@screens/clients/HomeScreen';
import { PartnerDetails } from '@screens/clients/PartnerDetails';
import { Profile } from '@screens/clients/Profile';
import { NewQuote } from '@screens/clients/quotes/NewQuote';
import { QuoteDetails } from '@screens/clients/quotes/QuoteDetails';
import { Quotes } from '@screens/clients/quotes/Quotes';
import { QuotesList } from '@screens/clients/quotes/QuotesList';
import { SearchQuote } from '@screens/clients/quotes/SearchQuote';
import { NewSchedule } from '@screens/clients/schedule/NewSchedule';
import { Schedules } from '@screens/clients/schedule/Schedules';
import { SchedulesDetails } from '@screens/clients/schedule/SchedulesDetails';
import { SearchSchedule } from '@screens/clients/schedule/SearchSchedule';
import { Services } from '@screens/clients/Services';
import { AddVehicle } from '@screens/clients/vehicles/AddVehicle';
import { VehicleDetails } from '@screens/clients/vehicles/VehicleDetails';
import { Vechicles } from '@screens/clients/vehicles/Vehicles';
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
  partnerDetails: { partnerId: string; typeofService: string };
  newSchedule: { locationId: string; typeofService: number };
  quotes: undefined;
  newQuote: { locationId: string; serviceId: string };
  quotesList: undefined;
  quoteDetails: { quoteId: string; hashId: string };
  searchQuote: { serviceId: string };
  schedulesDetails: { scheduleId: string };
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRotes>;

const { Screen, Navigator } = createBottomTabNavigator<AppRotes>();

export function AppRoutes() {
  const { colors, fonts } = useTheme();

  const iconSize = 7;

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
          paddingBottom: 5,
        },
        tabBarActiveTintColor: colors.orange[700],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          shadowColor: colors.gray[600],
          shadowOpacity: 0.2,
          minHeight: 60,
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
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
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
        name="newSchedule"
        component={NewSchedule}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="schedulesDetails"
        component={SchedulesDetails}
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

      <Screen
        name="quotes"
        component={Quotes}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="newQuote"
        component={NewQuote}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="searchQuote"
        component={SearchQuote}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="quotesList"
        component={QuotesList}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />

      <Screen
        name="quoteDetails"
        component={QuoteDetails}
        options={{ tabBarButton: () => null, tabBarStyle: { display: 'none' } }}
      />
    </Navigator>
  );
}
