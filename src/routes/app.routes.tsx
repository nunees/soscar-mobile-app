import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { Assistance } from '@screens/clients/Assistance';
import { HomeScreen } from '@screens/clients/HomeScreen';
import { PartnerDetails } from '@screens/clients/PartnerDetails';
import { ChangePassword } from '@screens/clients/profile/ChangePassword';
import EditProfileInformation from '@screens/clients/profile/EditProfileInformation';
import MyAccountInformation from '@screens/clients/profile/MyAccountInformation';
import { Profile } from '@screens/clients/profile/Profile';
import { LegalQuotes } from '@screens/clients/quotes/LegalQuotes';
import { NewLegalQuote } from '@screens/clients/quotes/NewLegalQuote';
import { NewQuote } from '@screens/clients/quotes/NewQuote';
import { QuoteDetails } from '@screens/clients/quotes/QuoteDetails';
import { Quotes } from '@screens/clients/quotes/Quotes';
import { QuotesList } from '@screens/clients/quotes/QuotesList';
import { SearchLegalQuote } from '@screens/clients/quotes/SearchLegalQuote';
import { SearchQuote } from '@screens/clients/quotes/SearchQuote';
import { NewSchedule } from '@screens/clients/schedule/NewSchedule';
import { Schedules } from '@screens/clients/schedule/Schedules';
import { SchedulesDetails } from '@screens/clients/schedule/SchedulesDetails';
import { SchedulesList } from '@screens/clients/schedule/SchedulesList';
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
  myaccountInformation: undefined;
  editProfileInformation: undefined;
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
  schedulesList: undefined;
  legalQuotes: undefined;
  newLegalQuote: { serviceId: string };
  searchLegalQuote: { serviceId: string };
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRotes>;

const { Screen, Navigator } = createBottomTabNavigator<AppRotes>();

export function AppRoutes() {
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
        navigationKey="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <Icon as={FontAwesome5} name="home" size={iconSize} color={color} />
          ),
        }}
      />
      <Screen
        name="services"
        component={Services}
        options={{
          title: 'Serviços',
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
        name="vehicles"
        component={Vechicles}
        options={{
          title: 'Veiculos',
          tabBarIcon: ({ color }) => (
            <Icon
              as={Ionicons}
              name="md-car-sport"
              size={iconSize}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="schedules"
        component={Schedules}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="searchSchedule"
        component={SearchSchedule}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="partnerDetails"
        component={PartnerDetails}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="newSchedule"
        component={NewSchedule}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="schedulesDetails"
        component={SchedulesDetails}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="schedulesList"
        component={SchedulesList}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
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
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="editProfileInformation"
        component={EditProfileInformation}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="vehicleDetails"
        component={VehicleDetails}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="addVehicle"
        component={AddVehicle}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="changePassword"
        component={ChangePassword}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="quotes"
        component={Quotes}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="newQuote"
        component={NewQuote}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="searchQuote"
        component={SearchQuote}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="quotesList"
        component={QuotesList}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="quoteDetails"
        component={QuoteDetails}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="legalQuotes"
        component={LegalQuotes}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="newLegalQuote"
        component={NewLegalQuote}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="searchLegalQuote"
        component={SearchLegalQuote}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Navigator>
  );
}
