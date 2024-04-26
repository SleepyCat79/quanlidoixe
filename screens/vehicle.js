import * as React from "react";
import {
  View,
  Text,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

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

function Vehicle() {
  const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [vehicles, setVehicles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [selectedVehicle, setselectedVehicle] = React.useState(null);
  const [imageFileIdArray, setImageFileIdArray] = React.useState(null);

  const isFocused = useIsFocused();
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setselectedVehicle(item)}
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
          {item.option}
        </Text>
      </View>
    </TouchableOpacity>
  );

  React.useEffect(() => {
    if (isFocused) {
      const fetchVehicle = async () => {
        const response = await fetch("http://10.0.2.2:8000/GetVehicle");
        const data = await response.json();
        setVehicles(data);
      };

      fetchVehicle();
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (
      selectedVehicle &&
      selectedVehicle.imageFileId &&
      selectedVehicle.imageFileId[0]
    ) {
      try {
        const parsedArray = JSON.parse(selectedVehicle.imageFileId[0]);
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
  }, [selectedVehicle]);

  if (isLoading) {
    return <ActivityIndicator />; // or some other loading indicator
  }
  return (
    <View style={{ width: "100%", height: "70%", backgroundColor: "white" }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedVehicle !== null}
        onRequestClose={() => {
          setselectedVehicle(null);
        }}
      >
        <View
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <View style={{ height: "35%" }}>
            <ImageBackground
              source={{
                uri:
                  imageFileIdArray && imageFileIdArray[0]
                    ? `http://10.0.2.2:8000/files/${imageFileIdArray[0]}`
                    : null,
              }}
              style={{
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "black",
                  opacity: 0.4, // Change this value to adjust the opacity
                  flex: 1,
                  width: "100%",
                  height: "100%",
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  position: "absolute",
                  fontFamily: "Inter-Medium",
                  color: "white",
                  fontSize: scale(16),
                  fontWeight: "bold",
                }}
              >
                Thông tin phương tiện
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setselectedVehicle(null);
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
            </ImageBackground>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <View
              style={{
                top: scale(20),
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text style={{ color: "gray", fontSize: scale(12) }}>
                  Tên phương tiện
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Inter-Medium",
                    fontWeight: "bold",
                    fontSize: scale(14),
                  }}
                >
                  {selectedVehicle ? selectedVehicle.name : ""}
                </Text>
              </View>
              <View style={{ flexDirection: "column", paddingLeft: scale(20) }}>
                <Text style={{ color: "gray", fontSize: scale(12) }}>
                  Tình trạng
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Inter-Medium",
                    fontWeight: "bold",
                    fontSize: scale(14),
                  }}
                >
                  {selectedVehicle ? selectedVehicle.status : ""}
                </Text>
              </View>
              <View style={{ flexDirection: "column", paddingLeft: scale(20) }}>
                <Text style={{ color: "gray", fontSize: scale(12) }}>
                  Lần cuối bảo trì
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Inter-Medium",
                    fontWeight: "bold",
                    fontSize: scale(14),
                  }}
                >
                  {selectedVehicle ? selectedVehicle.lastmaintenance : ""}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: "black",
                fontFamily: "Inter-Regular",
                fontSize: scale(12),
                top: scale(56),
              }}
            >
              {selectedVehicle ? selectedVehicle.address : ""}
            </Text>

            <TouchableOpacity
              style={{
                width: "90%",
                height: scale(70),
                backgroundColor: colors.Royalblue,
                top: scale(36),
                borderRadius: scale(20),
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                setselectedVehicle(null);
                navigation.navigate("Drivers", {
                  driverId: selectedVehicle.driver,
                });
              }}
            >
              <Ionicons
                name="people-circle"
                size={scale(36)}
                style={{ color: "white", left: scale(30) }}
              ></Ionicons>
              <Text
                style={{
                  left: scale(50),
                  fontFamily: "Inter-Medium",
                  color: "white",
                }}
              >
                Kiểm tra tài xế
              </Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={scale(36)}
                style={{ color: "white", left: scale(130) }}
              ></Ionicons>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: colors.Royalblue,
                  height: "60%",
                  width: "30%",
                  borderRadius: scale(20),
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  marginRight: scale(10),
                }}
              >
                <View
                  style={{
                    height: "40%",
                    width: "60%",
                    borderRadius: scale(60),
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="eyedrop-outline"
                    size={scale(30)}
                    style={{ color: colors.Royalblue }}
                  ></Ionicons>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    color: "white",
                    top: scale(5),
                  }}
                >
                  Loại nhiên liệu
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    color: "white",
                    top: scale(5),
                  }}
                >
                  {" "}
                  {selectedVehicle ? selectedVehicle.fuelType : ""}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.Royalblue,
                  height: "60%",
                  width: "30%",
                  borderRadius: scale(20),
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  marginRight: scale(10),
                }}
              >
                <View
                  style={{
                    height: "40%",
                    width: "60%",
                    borderRadius: scale(60),
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="logo-apple-ar"
                    size={scale(30)}
                    style={{ color: colors.Royalblue }}
                  ></Ionicons>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    color: "white",
                    top: scale(5),
                  }}
                >
                  Kích thước
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    color: "white",
                    top: scale(5),
                  }}
                >
                  {" "}
                  {selectedVehicle ? selectedVehicle.size : ""}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.Royalblue,
                  height: "60%",
                  width: "30%",
                  borderRadius: scale(20),
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    height: "40%",
                    width: "60%",
                    borderRadius: scale(60),
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="reorder-three-outline"
                    size={scale(30)}
                    style={{ color: colors.Royalblue }}
                  ></Ionicons>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    color: "white",
                    top: scale(5),
                  }}
                >
                  Trọng lượng
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    color: "white",
                    top: scale(5),
                  }}
                >
                  {" "}
                  {selectedVehicle ? selectedVehicle.weight : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={vehicles}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

export default Vehicle;
