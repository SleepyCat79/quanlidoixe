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
const AddDriverModal = ({ isVisible, onClose }) => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [imageUri, setImageUri] = React.useState([]);
  const [selectedValue, setSelectedValue] = React.useState("Còn hạn");
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
            Thêm tài xế
          </Text>
        </View>
        <View style={{ height: "1%" }}>
          <TextInput
            placeholder="Họ và tên tài xế"
            placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
            keyboardType="ascii-capable"
            value={name}
            style={{
              ...styles.addinput,
              top: scale(70),
              fontSize: scale(14),
              fontFamily: "Roboto-Regular",
              color: colors.black,
            }}
            onChangeText={setName}
          ></TextInput>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              placeholder="Tuổi"
              placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
              keyboardType="number-pad"
              value={age}
              style={{
                ...styles.addinput,
                top: scale(100),
                width: "20%",
                alignSelf: "flex-start",
                left: scale(20),
                fontSize: scale(14),
                fontFamily: "Roboto-Regular",
                color: colors.black,
              }}
              onChangeText={setAge}
            ></TextInput>
            <TextInput
              placeholder="Kinh nghiệm hành nghề"
              placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
              keyboardType="phone-pad"
              value={experience}
              style={{
                ...styles.addinput,
                top: scale(100),
                left: scale(40),
                width: "64%",
                fontSize: scale(14),
                fontFamily: "Roboto-Regular",
                color: colors.black,
              }}
              onChangeText={setExperience}
            ></TextInput>
          </View>
          <TextInput
            placeholder="Địa chỉ"
            placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
            keyboardType="ascii-capable"
            value={address}
            style={{
              ...styles.addinput,
              top: scale(130),
              fontSize: scale(14),
              fontFamily: "Roboto-Regular",
              color: colors.black,
            }}
            onChangeText={setAddress}
          ></TextInput>
          <TextInput
            placeholder="Số điện thoại"
            placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
            keyboardType="phone-pad"
            value={phoneNumber}
            style={{
              ...styles.addinput,
              top: scale(160),
              fontSize: scale(14),
              fontFamily: "Roboto-Regular",
              color: colors.black,
            }}
            onChangeText={setPhoneNumber}
          ></TextInput>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                borderColor: "black",
                borderWidth: 1.5,
                width: wp("45%"),
                height: hp("7.5%"),
                borderStyle: "solid",
                alignItems: "center",
                flexDirection: "row",
                alignSelf: "center",
                padding: Padding.p_base,
                top: scale(180),
                alignSelf: "flex-start",
                left: scale(20),
              }}
              onPress={() => showDatepicker("start")}
            >
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={startDate}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                />
              )}
              <Text>
                {startDate ? startDate.toLocaleDateString() : "Ngày cấp bằng"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderColor: "black",
                borderWidth: 1.5,
                width: wp("45%"),
                height: hp("7.5%"),
                borderStyle: "solid",
                alignItems: "center",
                flexDirection: "row",
                alignSelf: "center",
                padding: Padding.p_base,
                top: scale(180),
                alignSelf: "flex-start",
                left: scale(30),
              }}
              onPress={() => showDatepicker("end")}
            >
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={endDate}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                />
              )}
              <Text>
                {endDate ? endDate.toLocaleDateString() : "Ngày hết hạn"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              height: scale(260),
              top: scale(220),
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TouchableOpacity
              style={{
                width: "90%",
                height: scale(20),
                bottom: scale(30),
                alignSelf: "center",
                backgroundColor: colors.Royalblue,
                justifyContent: "center", // Added this
                alignItems: "center", // And this
              }}
              onPress={selectImage}
            >
              <Text style={{ color: "white" }}>Upload Image</Text>
            </TouchableOpacity>
            <Text
              style={{
                right: scale(130),
                bottom: scale(30),
                fontSize: scale(14),
                fontFamily: "Roboto-Regular",
              }}
            >
              Preview
            </Text>
            <View style={{ flexDirection: "row" }}>
              {imageUri &&
                imageUri.length > 0 &&
                imageUri.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri: uri }}
                    style={{
                      width: scale(60),
                      height: scale(60),
                      right: scale(110),
                      bottom: scale(20),
                    }}
                  />
                ))}
            </View>
            <TouchableOpacity
              style={{
                width: "90%",
                height: scale(40),
                backgroundColor: colors.Royalblue,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={submitDriver}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Bold",
                  color: "white",
                  fontSize: scale(16),
                }}
              >
                Xác nhận thêm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddDriverModal;

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