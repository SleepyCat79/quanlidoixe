import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Driver from "./drivers";
import * as React from "react";
import {
  View,
  Text,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ScaledSheet, scale } from "react-native-size-matters";
import colors from "../assets/colors/color";
import Vehicle from "./vehicle";
const Tab = createMaterialTopTabNavigator();
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: colors.white,
        height: scale(30),
        width: wp("90%"),
        elevation: 1,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: scale(20),
              backgroundColor: isFocused ? colors.Royalblue : "white", // Change the colors as needed
            }}
          >
            <Text
              style={{
                color: isFocused ? "white" : "gray",
                fontSize: 12,
                fontFamily: "Inter-SemiBold",
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
async function loadFonts() {
  await Font.loadAsync({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.otf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.otf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.otf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.otf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });
}
function Fleet() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
      } catch (e) {
      } finally {
        setFontsLoaded(true);
      }
    }

    prepare();
  }, []);
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.Royalblue,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: scale(20),
            top: scale(100),
            left: scale(20),
            fontFamily: "Roboto-Bold",
          }}
        >
          Đội xe
        </Text>
        <TouchableOpacity>
          <Ionicons
            name="search"
            size={scale(20)}
            style={{ color: "white", top: scale(100), left: scale(110) }}
          ></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="add"
            size={scale(24)}
            style={{ color: "white", top: scale(99), left: scale(120) }}
          ></Ionicons>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: "100%",
          borderRadius: scale(20),
          alignSelf: "center",

          top: scale(120),
        }}
      >
        <Tab.Navigator
          style={{ alignSelf: "center", top: scale(20) }}
          tabBar={(props) => <CustomTabBar {...props} />}
        >
          <Tab.Screen name="Drivers" component={Driver} />
          <Tab.Screen name="Vehicles" component={Vehicle} />
        </Tab.Navigator>
      </View>
    </View>
  );
}
export default Fleet;
