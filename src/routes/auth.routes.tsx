import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SignIn } from '@screens/SignIn';
import { SignUp } from '@screens/SignUp';
import { TermsOfUsage } from '@screens/TermsOfUsage';

type AuthRotes = {
  SignIn: undefined;
  SignUp: undefined;
  terms: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRotes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRotes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SignIn" component={SignIn} />
      <Screen name="SignUp" component={SignUp} />
      <Screen name="terms" component={TermsOfUsage} />
    </Navigator>
  );
}
