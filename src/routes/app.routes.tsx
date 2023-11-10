import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { ChangePassword } from '@screens/ChangePassword';
import { Archives } from '@screens/clients/Archives';
import { AssistanceArchieve } from '@screens/clients/assistance/AssistanceArchive';
import { AssistanceContactType } from '@screens/clients/assistance/AssistanceContactType';
import { AssistancesList } from '@screens/clients/assistance/AssistancesList';
import { AssistanceSearch } from '@screens/clients/assistance/AsssistanceSearch';
import { HomeScreen } from '@screens/clients/HomeScreen';
import { LegalQuoteDetails } from '@screens/clients/legalQuotes/LegalQuoteDetails';
import { LegalQuotes } from '@screens/clients/legalQuotes/LegalQuotes';
import { LegalQuotesList } from '@screens/clients/legalQuotes/LegalQuotesList';
import { NewLegalQuote } from '@screens/clients/legalQuotes/NewLegalQuote';
import { SearchLegalQuote } from '@screens/clients/legalQuotes/SearchLegalQuote';
import { PartnerDetails } from '@screens/clients/PartnerDetails';
import { NewQuote } from '@screens/clients/quotes/NewQuote';
import { QuoteDetails } from '@screens/clients/quotes/QuoteDetails';
import { Quotes } from '@screens/clients/quotes/Quotes';
import { QuotesList } from '@screens/clients/quotes/QuotesList';
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
import EditProfileInformation from '@screens/EditProfileInformation';
import MyAccountInformation from '@screens/MyAccountInformation';
import { Notifications } from '@screens/Notifications';
import { LocationDetails } from '@screens/partners/locations/LocationDetails';
import { Profile } from '@screens/Profile';
import { QuoteDone } from '@screens/QuoteDone';
import { TaskDone } from '@screens/TeaskDone';
import { ValidateDocument } from '@screens/ValidateDocument';
import { Icon, useTheme } from 'native-base';

type AppRotes = {
  home: undefined;
  vehicles: undefined;
  profile: undefined;
  myaccountInformation: undefined;
  editProfileInformation: undefined;
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
  quoteDetails: { quoteId: string; locationId: string; vehicleId: string };
  searchQuote: { serviceId: string };
  schedulesDetails: { scheduleId: string };
  schedulesList: undefined;

  // Archives routes
  archives: undefined;

  // Legal quotes routes
  legalQuotes: undefined;
  legalQuotesList: undefined;
  newLegalQuote: { serviceId: string };
  searchLegalQuote: { serviceId: string };
  legalQuoteDetails: { hashId: string };

  // Assistance routes

  // List all assistances
  assistanceList: undefined;

  // Assistance contact type (on-line and archive)
  assistanceContactType: { serviceId: number };

  // Assistance contact search
  assistanceSearch: { serviceId: number };

  // Assistance saved on archive
  assistanceArchive: { serviceId: number };

  locationDetails: { locationId: string };

  quoteDone: undefined;

  // Other routes
  taskDone: { date: string };
  validateDocument: undefined;
  notifications: undefined;
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
              mt={2}
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
        name="legalQuotesList"
        component={LegalQuotesList}
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

      <Screen
        name="taskDone"
        component={TaskDone}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="quoteDone"
        component={QuoteDone}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="legalQuoteDetails"
        component={LegalQuoteDetails}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="locationDetails"
        component={LocationDetails}
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
        name="assistanceList"
        component={AssistancesList}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="assistanceContactType"
        component={AssistanceContactType}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="assistanceSearch"
        component={AssistanceSearch}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="assistanceArchive"
        component={AssistanceArchieve}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Screen
        name="archives"
        component={Archives}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Navigator>
  );
}
