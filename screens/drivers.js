import * as React from "react";
import {
  View,
  Text,
  Button,
  Modal,
  Image,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import tsu from "../assets/images/tsu.jpg";
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
  { name: "Huy Vo", location: "Ho Chi Minh" },
  { name: "Huy Vo", location: "Ho Chi Minh" },
  { name: "Huy Vo", location: "Ho Chi Minh" },
  { name: "Huy Vo", location: "Ho Chi Minh" },
  { name: "Huy Vo", location: "Ho Chi Minh" },
  { name: "Huy Vo", location: "Ho Chi Minh" },
  { name: "Huy Vo", location: "Ho Chi Minh" },
  { name: "Huy Vo", location: "Ho Chi Minh" },
  { name: "Huy Vo", location: "Ho Chi Minh" },
  { name: "Huy Vo", location: "Ho Chi Minh" },
  // Add more items here
];

function Driver() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [drivers, setDrivers] = React.useState([]);
  const [selectedDriver, setSelectedDriver] = React.useState(null);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      const fetchDrivers = async () => {
        const response = await fetch("http://192.168.1.3:8000/GetDrivers");
        const data = await response.json();
        setDrivers(data);
      };

      fetchDrivers();
    }
  }, [isFocused]); // Refetch when screen comes into focus

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
      onPress={() => setSelectedDriver(item)}
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
          {item.address}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedDriver !== null}
        onRequestClose={() => {
          setSelectedDriver(null);
        }}
      >
        <View
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <View
            style={{
              flexDirection: "column",
              height: "25%",
              backgroundColor: "#2A7C76",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                // Add this
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelectedDriver(null);
                }}
                style={{
                  position: "absolute",
                  left: scale(10),
                  top: scale(52),
                }} // Add this
              >
                <Ionicons
                  name="close-sharp"
                  size={scale(30)}
                  style={{ color: "white" }} // Remove top and left
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: "white",
                  fontFamily: "Roboto-Bold",
                  fontSize: scale(17),
                  top: scale(52),
                }}
              >
                Driver Profile
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity>
                <View
                  style={{
                    width: scale(60),
                    borderRadius: scale(10),
                    alignItems: "center",
                    justifyContent: "center",
                    height: scale(50),
                    backgroundColor: "#EDEAE0",
                    top: scale(90),
                    flexDirection: "column",
                    right: scale(40),
                  }}
                >
                  <Ionicons
                    name="call-outline"
                    size={scale(18)}
                    style={{ color: colors.Royalblue }}
                  />
                  <Text
                    style={{
                      color: colors.Royalblue,
                      fontFamily: "Roboto-Regular",
                    }}
                  >
                    Call
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  height: scale(100),
                  width: scale(100),
                  backgroundColor: colors.Royalblue,
                  borderRadius: scale(20),
                  top: scale(90),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ height: scale(90), width: scale(90) }}
                  source={tsu}
                />
              </View>
              <TouchableOpacity>
                <View
                  style={{
                    width: scale(60),
                    borderRadius: scale(10),
                    alignItems: "center",
                    justifyContent: "center",
                    height: scale(50),
                    backgroundColor: "#EDEAE0",
                    top: scale(90),
                    flexDirection: "column",
                    left: scale(40),
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={scale(18)}
                    style={{ color: colors.Royalblue }}
                  />
                  <Text
                    style={{
                      color: colors.Royalblue,
                      fontFamily: "Roboto-Regular",
                    }}
                  >
                    Mail
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={drivers}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

export default Driver;
