import { StyleSheet, Text, View, StatusBar, LogBox } from "react-native";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { THEME } from "./src/theme";
import { NativeBaseProvider } from "native-base";
import { Loading } from "@components/Loading";

import { Routes } from "@routes/index";
import { AuthContextProvider } from "@contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
