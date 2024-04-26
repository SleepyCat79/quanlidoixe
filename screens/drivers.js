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

function Driver({ route, navigation }) {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [drivers, setDrivers] = React.useState([]);
  const [selectedDriver, setSelectedDriver] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false); // Add a loading state
  const [imageFileIdArray, setImageFileIdArray] = React.useState(null);

  const isFocused = useIsFocused();
  React.useEffect(() => {
    // Only proceed if route.params is defined
    if (route.params) {
      const { driverId } = route.params;

      // Only fetch driver data if driverId is present
      if (driverId) {
        setIsLoading(true); // Set loading state to true
        // Fetch the driver data using the driverId
        fetch(`http://10.0.2.2:8000/GetDriver/${driverId}`)
          .then((response) => response.json())
          .then((data) => {
            // Set the fetched driver data as the selected driver
            setSelectedDriver(data);
            setIsLoading(false); // Set loading state to false
          })
          .catch((error) => {
            console.error("Error:", error);
            setIsLoading(false); // Set loading state to false
          });
      }
    }
  }, [route.params]); // Add route.params as a dependency

  React.useEffect(() => {
    if (isFocused) {
      const fetchDrivers = async () => {
        const response = await fetch("http://10.0.2.2:8000/GetDrivers");
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
  React.useEffect(() => {
    if (selectedDriver && selectedDriver.license && selectedDriver.license[0]) {
      try {
        const parsedArray = JSON.parse(selectedDriver.license[0]);
        if (parsedArray && parsedArray[0]) {
          setImageFileIdArray(parsedArray);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [selectedDriver]);

  return (
    <View style={{ width: "100%", height: "70%", backgroundColor: "white" }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedDriver !== null && !isLoading} // Modify the visible prop to also depend on the loading state
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
                  left: scale(20),
                }}
              >
                Driver Profile
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedDriver(null);
                }}
                style={{
                  left: scale(80),
                  top: scale(52),
                }} // Add this
              >
                <Ionicons
                  name="calendar-outline"
                  size={scale(30)}
                  style={{ color: "white" }} // Remove top and left
                />
              </TouchableOpacity>
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
                  source={{
                    uri:
                      imageFileIdArray && imageFileIdArray[0]
                        ? `http://10.0.2.2:8000/files/${imageFileIdArray[0]}`
                        : null, // Assuming tsu is a string URL
                  }}
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
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text
              style={{
                color: "black",
                fontFamily: "Inter-Medium",
                fontSize: scale(22),
                top: scale(58),
              }}
            >
              {selectedDriver ? selectedDriver.name : ""}
            </Text>
            <Text
              style={{
                color: "black",
                fontFamily: "Inter-Regular",
                fontSize: scale(12),
                top: scale(56),
              }}
            >
              {selectedDriver ? selectedDriver.address : ""}
            </Text>
            <Text
              style={{
                color: "black",
                fontFamily: "Roboto-Bold",
                fontSize: scale(16),
                top: scale(70),
              }}
            >
              Thông tin giấy phép
            </Text>
            <View
              style={{
                width: "70%",
                height: scale(200),
                backgroundColor: colors.Royalblue,
                top: scale(86),
                borderRadius: scale(20),
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "30%",
                  height: "35%",
                  backgroundColor: "white",
                  top: scale(20),
                  borderRadius: scale(30),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="card-outline"
                  size={scale(46)}
                  style={{ color: colors.Royalblue }}
                ></Ionicons>
              </View>
              <Text
                style={{
                  color: "white",
                  fontSize: scale(16),
                  fontFamily: "Inter-Regular",
                  fontWeight: 600,
                  top: scale(40),
                }}
              >
                Ngày cấp bằng:{" "}
                {selectedDriver
                  ? new Date(selectedDriver.startDate)
                      .toISOString()
                      .split("T")[0]
                  : ""}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: scale(16),
                  fontFamily: "Inter-Regular",
                  fontWeight: 600,
                  top: scale(50),
                }}
              >
                Ngày cấp bằng:{" "}
                {selectedDriver
                  ? new Date(selectedDriver.endDate).toISOString().split("T")[0]
                  : ""}
              </Text>
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
