import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./screens/signup";
import SignIn from "./screens/signin";
import * as React from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import MaintainScreen from "./screens/maintainscreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

const Stack = createNativeStackNavigator();

async function loadFonts() {
  await Font.loadAsync({
    "Inter-Bold": require("./assets/fonts/Inter-Bold.otf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.otf"),
    "Inter-Regular": require("./assets/fonts/Inter-Regular.otf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.otf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });
}

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(null);
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  React.useEffect(() => {
    loadFonts().then(() => {
      SplashScreen.hideAsync();
      setFontsLoaded(true);
    });

    // Check if user is logged in
    const checkUserLoggedIn = async () => {
      const user = await AsyncStorage.getItem("user");
      setIsUserLoggedIn(user ? true : false);
    };

    checkUserLoggedIn();
  }, []);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isUserLoggedIn ? (
          <Stack.Screen
            name="MaintainScreen"
            component={MaintainScreen}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MaintainScreen"
              component={MaintainScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
      {/* Add this closing tag */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
