import * as React from "react";
import {
  View,
  Text,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  FlatList,
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
const data = [
  { name: "Truck Car", location: "Ho Chi Minh" },
  { name: "Truck Car", location: "Ho Chi Minh" },
  { name: "Truck Car", location: "Ho Chi Minh" },
  { name: "Truck Car", location: "Ho Chi Minh" },
  { name: "Truck Car", location: "Ho Chi Minh" },
  { name: "Truck Car", location: "Ho Chi Minh" },
  { name: "Truck Car", location: "Ho Chi Minh" },
  { name: "Truck Car", location: "Ho Chi Minh" },
  { name: "Truck Car", location: "Ho Chi Minh" },
  { name: "Truck Car", location: "Ho Chi Minh" },
  // Add more items here
];
function Vehicle() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        height: scale(55),
        width: wp("90%"),
        backgroundColor: "rgba(128, 128, 128, 0.05)", // gray color with 0.1 opacity
        borderRadius: scale(10),
        alignSelf: "center",
        justifyContent: "center",
        marginTop: scale(20),
      }}
    >
      <View style={{ flexDirection: "column" }}>
        <Text
          style={{
            left: scale(20),
            top: scale(-3),
            fontFamily: "Inter-Medium",
            fontSize: scale(14),
            color: colors.Royalblue,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: scale(11),
            color: "black",
            left: scale(20),
          }}
        >
          {item.location}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
    <View style={{ width: "100%", height: "70%", backgroundColor: "white" }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

export default Vehicle;
