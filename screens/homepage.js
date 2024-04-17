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
import { useNavigation } from "@react-navigation/native";

import colors from "../assets/colors/color";
import { Ionicons } from "@expo/vector-icons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Padding, Border } from "../assets/globalstyle";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { ScaledSheet, scale } from "react-native-size-matters";
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

function Homepage() {
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
    <SafeAreaView
      style={{ backgroundColor: "white", width: "100%", height: "100%" }}
    >
      <Text
        style={{
          color: "black",
          fontSize: 20,
          top: scale(60),
          fontFamily: "Inter-Regular",
          left: scale(40),
        }}
      >
        Welcome, {"\n"} <Text style={{ color: colors.Royalblue }}>Huy Vo</Text>
      </Text>
      <View
        style={{
          top: scale(90),
          left: scale(10),
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%", // make sure the View takes the full width
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto-Regular",
            fontSize: scale(16),
          }}
        >
          Doanh Thu
        </Text>
        <TouchableOpacity>
          <Text style={{ right: scale(20), color: "#666", opacity: 0.7 }}>
            Chi tiết
          </Text>
        </TouchableOpacity>
      </View>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={wp("100%")} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#FBFBFB",
          backgroundGradientFrom: "#FBFBFB",
          backgroundGradientTo: "#FBFBFB",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `#1488D8`,
          labelColor: (opacity = 1) => `#1488D8`,
          style: {
            borderRadius: 6,
          },
          propsForDots: {
            r: "3",
            strokeWidth: "0.5",
            stroke: "#FBFBFB",
          },
        }}
        bezier
        style={{
          marginVertical: scale(110),
          borderRadius: scale(20),
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          top: scale(-100),
          left: scale(10), // make sure the View takes the full width
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto-Regular",
            fontSize: scale(16),
          }}
        >
          Lịch bảo trì
        </Text>
        <TouchableOpacity>
          <Text style={{ right: scale(20), color: "#666", opacity: 0.7 }}>
            Chi tiết
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            height: scale(55),
            width: wp("90%"),
            backgroundColor: "rgba(128, 128, 128, 0.05)", // gray color with 0.1 opacity
            borderRadius: scale(10),
            top: scale(-80),
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="build-outline"
              size={scale(25)}
              style={{
                color: colors.Royalblue,
                left: scale(5),
              }}
            ></Ionicons>
            <Text
              style={{
                left: scale(20),
                top: scale(-5),
                fontFamily: "Inter-Medium",
                fontSize: scale(14),
              }}
            >
              Maintaince Vehicle
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: scale(11),
                top: scale(7),
                right: scale(108),
              }}
            >
              {"\n"} Due On: Jan 20, 2022
            </Text>
          </View>
        </View>
        <View
          style={{
            height: scale(55),
            width: wp("90%"),
            backgroundColor: "#1488D8", // gray color with 0.1 opacity
            borderRadius: scale(10),
            top: scale(-80),
            alignSelf: "center",
            marginTop: scale(20),
            marginBottom: scale(20),
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="build-outline"
              size={scale(25)}
              style={{
                color: "white",
                left: scale(5),
              }}
            ></Ionicons>
            <Text
              style={{
                left: scale(20),
                top: scale(-5),
                fontFamily: "Inter-Medium",
                fontSize: scale(14),
                color: "white",
              }}
            >
              Maintaince Vehicle
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: scale(11),
                top: scale(7),
                color: "white",
                right: scale(108),
              }}
            >
              {"\n"} Due On: Jan 20, 2022
            </Text>
          </View>
        </View>
        <View
          style={{
            height: scale(55),
            width: wp("90%"),
            backgroundColor: "rgba(128, 128, 128, 0.05)", // gray color with 0.1 opacity
            borderRadius: scale(10),
            top: scale(-80),
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="build-outline"
              size={scale(25)}
              style={{
                color: colors.Royalblue,
                left: scale(5),
              }}
            ></Ionicons>
            <Text
              style={{
                left: scale(20),
                top: scale(-5),
                fontFamily: "Inter-Medium",
                fontSize: scale(14),
              }}
            >
              Maintaince Vehicle
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: scale(11),
                top: scale(7),
                right: scale(108),
              }}
            >
              {"\n"} Due On: Jan 20, 2022
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({});

export default Homepage;
