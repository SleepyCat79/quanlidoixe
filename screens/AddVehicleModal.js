import * as React from "react";
import {
  View,
  Text,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScaledSheet, scale } from "react-native-size-matters";
import colors from "../assets/colors/color";
import { Padding, Border } from "../assets/globalstyle";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import truck from "../assets/images/truck.jpg";
import container from "../assets/images/container.png";
import coach from "../assets/images/coach.jpg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DateTimePicker from "@react-native-community/datetimepicker";

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
class Driver {
  constructor(
    name,
    age,
    experience,
    address,
    phoneNumber,
    license,
    startDate,
    endDate
  ) {
    this.name = name;
    this.age = age;
    this.experience = experience;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.license = license;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

const createDriver = (
  name,
  age,
  experience,
  address,
  phoneNumber,
  imageUri,
  startDate,
  endDate
) => {
  return new Driver(
    name,
    age,
    experience,
    address,
    phoneNumber,
    imageUri,
    startDate,
    endDate
  );
};
const AddVehicle = ({ isVisible, onClose }) => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState("Xe tải");
  const [imageUri, setImageUri] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);

  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [age, setAge] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [license, setLicense] = React.useState("");
  const [name, setName] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [mode, setMode] = React.useState("date");
  const [show, setShow] = React.useState(false);
  const status = ["Đang hoạt động", "Bảo trì"];
  const options = ["Xe tải", "Xe khách", "Xe container"];
  const [selectstatus, setStatus] = React.useState("Tình trạng");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    if (mode === "start") {
      setStartDate(currentDate);
    } else {
      setEndDate(currentDate);
    }
  };

  const showDatepicker = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // Step 2: Push new image URI to the imageUri array
      setImageUri((oldArray) => [...oldArray, result.assets[0].uri]);
    }
  };
  const submitDriver = async () => {
    const driver = createDriver(
      name,
      age,
      experience,
      address,
      phoneNumber,
      imageUri,
      startDate,
      endDate
    );
    console.log(driver);
    try {
      const response = await fetch("http://192.168.1.3:8000/AddDriver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...driver,
          license: JSON.stringify(driver.license), // convert array to string for sending as JSON
        }),
      });
      const data = await response.json();
      console.log(data);

      console.log("Success:", data);
    } catch (error) {
      console.error(error);
    }
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
  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.gradient, flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={true}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          flexDirection: "column",
          overflow: "scroll",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity title="Close" onPress={onClose}>
            <Ionicons
              name="close-sharp"
              size={scale(30)}
              style={{ top: scale(36), left: scale(10) }}
            />
          </TouchableOpacity>
          <Text
            style={{
              top: scale(40),
              left: scale(14),
              fontSize: scale(20),
              fontFamily: "Roboto-Regular",
            }}
          >
            Thêm phương tiện
          </Text>
        </View>
        <View style={{ height: "100%" }}>
          <TouchableOpacity
            style={{
              flexDirection: "column",
              height: "8%",
              top: scale(70),
              left: scale(20),
            }} // Add a specific width
          >
            <View style={{ flexDirection: "row", height: "100%" }}>
              <Ionicons
                name="person-outline"
                style={{}}
                size={scale(24)}
              ></Ionicons>
              <Text
                style={{
                  ...styles.addinput,
                  borderWidth: 0,
                  fontSize: scale(14),
                  bottom: scale(20),
                  fontFamily: "Roboto-Regular",
                  fontWeight: "200",
                  color: colors.black,
                }}
              >
                Thêm tài xế
              </Text>
            </View>
            <Text
              style={{
                left: scale(40),
                fontSize: scale(10),
                fontFamily: "Roboto-Regular",
                color: colors.black,
                bottom: scale(35),
              }}
            >
              John's list
            </Text>
            <Ionicons
              name="chevron-forward"
              style={{ left: scale(290), position: "absolute" }}
              size={scale(24)}
            ></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              height: "8%",
              width: "100%",
              backgroundColor: "rgba(128, 128, 128, 0.2)", // 50% opacity
              alignItems: "center",
              top: scale(80),
            }}
            onPress={() => setModalVisible(true)}
          >
            <Image
              style={{ height: scale(40), width: scale(40), left: scale(15) }}
              source={
                selectedVehicle === "Xe tải"
                  ? truck
                  : selectedVehicle === "Xe khách"
                  ? coach
                  : container
              }
            />
            <Text style={{ left: scale(30), fontFamily: "Inter-Medium" }}>
              Chọn mẫu xe
            </Text>
            <Text style={{ left: scale(150), fontFamily: "Inter-Medium" }}>
              {selectedVehicle}
            </Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setSelectedVehicle(option);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: scale(16),
                      padding: scale(10),
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              placeholder="Tên phương tiện"
              placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
              keyboardType="ascii-capable"
              value={name}
              style={{
                ...styles.addinput,
                top: scale(120),
                left: scale(10),
                width: "70%",
                fontSize: scale(14),
                fontFamily: "Roboto-Regular",
                color: colors.black,
              }}
              onChangeText={setName}
            ></TextInput>
            <Text
              style={{ top: scale(150), left: scale(20), fontSize: scale(11) }}
            >
              Ex: Ford F-150
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "column" }}>
              <TextInput
                placeholder="Trọng lượng"
                placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
                keyboardType="ascii-capable"
                value={name}
                style={{
                  ...styles.addinput,
                  top: scale(140),
                  left: scale(10),
                  width: scale(150),
                  fontSize: scale(14),
                  fontFamily: "Roboto-Regular",
                  color: colors.black,
                }}
                onChangeText={setName}
              ></TextInput>
              <Text style={{ top: scale(150), left: scale(20) }}>1 tấn</Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <TextInput
                placeholder="Kích thước"
                placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
                keyboardType="ascii-capable"
                value={name}
                style={{
                  ...styles.addinput,
                  top: scale(140),
                  left: scale(30),
                  width: scale(150),
                  fontSize: scale(14),
                  fontFamily: "Roboto-Regular",
                  color: colors.black,
                }}
                onChangeText={setName}
              ></TextInput>
              <Text style={{ top: scale(150), left: scale(40) }}>
                1995 x 2030 x 6184 (mm)
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", top: scale(30) }}>
            <View style={{ flexDirection: "column" }}>
              <TextInput
                placeholder="Loại nhiên liệu"
                placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
                keyboardType="ascii-capable"
                value={name}
                style={{
                  ...styles.addinput,
                  top: scale(140),
                  left: scale(10),
                  width: scale(150),
                  fontSize: scale(14),
                  fontFamily: "Roboto-Regular",
                  color: colors.black,
                }}
                onChangeText={setName}
              ></TextInput>
              <Text style={{ top: scale(150), left: scale(20) }}>
                {" "}
                87 octane
              </Text>
            </View>
            <TouchableOpacity
              style={{
                ...styles.addinput,
                top: scale(132),
                left: scale(30),
                width: scale(150),
              }}
              onPress={() => setModalVisible2(true)}
            >
              <Text style={{ fontFamily: "Inter-Medium" }}>{selectstatus}</Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible2}
              onRequestClose={() => {
                setModalVisible2(!modalVisible);
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                }}
              >
                {status.map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => {
                      setStatus(status);
                      setModalVisible2(false);
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter-Medium",
                        fontSize: scale(16),
                        padding: scale(10),
                      }}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Modal>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: colors.Royalblue,
              top: scale(200),
              height: scale(30),
              width: "90%",
              borderRadius: scale(10),
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white" }}>Thêm hình ảnh</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddVehicle;
const styles = ScaledSheet.create({
  addinput: {
    borderColor: "black",
    borderWidth: 1.5,
    width: wp("90%"),
    height: hp("7.5%"),
    borderStyle: "solid",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    padding: Padding.p_base,
  },
});
