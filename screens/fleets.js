import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AddDriverModal from "./AddDriverModal";
import AddVehicleModal from "./AddVehicleModal";
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
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";

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
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState("");
  const state = useNavigationState((state) => state);
  const handleAddButtonPress = () => {
    const currentTab = state.routes[state.index].state
      ? state.routes[state.index].state.index === 0
        ? "Drivers"
        : "Vehicles"
      : "Drivers";

    setModalType(currentTab === "Drivers" ? "Add Driver" : "Add Vehicle");
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
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
  if (!fontsLoaded) {
    return null; // Or return a loading indicator
  }
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.Royalblue,
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        {modalType === "Add Driver" ? (
          <AddDriverModal isVisible={isModalVisible} onClose={closeModal} />
        ) : (
          <AddVehicleModal isVisible={isModalVisible} onClose={closeModal} />
        )}
      </Modal>
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

        <TouchableOpacity onPress={handleAddButtonPress}>
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
