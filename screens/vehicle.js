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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

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
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [vehicles, setVehicles] = React.useState([]);
  const [selectedDriver, setSelectedDriver] = React.useState(null);
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
      onPress={() => setSelectedDriver(item)}
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
        const response = await fetch("http://192.168.1.3:8000/GetVehicle");
        const data = await response.json();
        setVehicles(data);
      };

      fetchVehicle();
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (
      selectedDriver &&
      selectedDriver.imageFileId &&
      selectedDriver.imageFileId[0]
    ) {
      try {
        const parsedArray = JSON.parse(selectedDriver.imageFileId[0]);
        if (parsedArray && parsedArray[0]) {
          setImageFileIdArray(parsedArray);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    console.log(imageFileIdArray);
  }, [selectedDriver]);
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
          <View style={{ height: "35%" }}>
            <ImageBackground
              source={{
                uri:
                  selectedDriver &&
                  selectedDriver.imageFileId &&
                  imageFileIdArray[0]
                    ? `http://192.168.1.3:8000/files/${imageFileIdArray[0]}`
                    : null,
              }}
              style={{
                flexDirection: "column",
                height: "100%",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  opacity: 0.5, // Change this value to adjust the opacity
                  flex: 1,
                }}
              />
            </ImageBackground>
          </View>

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
              Thông tin phương tiện
            </Text>
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
            {selectedDriver && selectedDriver.imageFileId ? (
              <Image
                source={{
                  uri: `http://192.168.1.3:8000/files/${selectedDriver.imageFileId}`,
                }}
              />
            ) : null}
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
                {selectedDriver && selectedDriver.imageFileId ? (
                  <Image
                    source={{
                      uri: `http://192.168.1.3:8000/files/1714068871337-bezkoder-4e110b03-0102-4dd3-acb7-bec54375b10b.jpeg`,
                    }}
                  />
                ) : null}
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
