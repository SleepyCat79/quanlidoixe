import * as React from "react";
import {
  View,
  Text,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Alert,
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
  const [startShow, setStartShow] = React.useState(false);
  const [endShow, setEndShow] = React.useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (mode === "start") {
      setStartDate(currentDate);
      setStartShow(Platform.OS === "ios"); // hide start date picker
    } else {
      setEndDate(currentDate);
      setEndShow(Platform.OS === "ios"); // hide end date picker
    }
  };

  const showDatepicker = (currentMode) => {
    setMode(currentMode);
    if (currentMode === "start") {
      setStartShow(true); // show start date picker
    } else {
      setEndShow(true); // show end date picker
    }
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

  const uploadImages = async (imageUris) => {
    let filenames = [];

    for (let uri of imageUris) {
      let formData = new FormData();
      let fileName = uri.split("/").pop();

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(fileName);
      let type = match ? `image/${match[1]}` : `image`;

      // Append the image
      formData.append("file", { uri: uri, name: fileName, type });

      try {
        const response = await fetch(
          "https://quanlidoixe-p8k7.vercel.app/upload",
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const data = await response.json();
        console.log("Success:", data);
        let filename = data.filename;

        // Assuming the server returns the uploaded filename
        filenames.push(data.filename);
        console.log("File names:", filenames);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    return filenames;
  };
  const submitDriver = async () => {
    if (
      !name ||
      !age ||
      !experience ||
      !address ||
      !phoneNumber ||
      !imageUri ||
      !startDate ||
      !endDate
    ) {
      Alert.alert("Missing fields", "Vui lòng điền đầy đủ thông tin.", [
        { text: "OK" },
      ]);
      return;
    }

    try {
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

      const driverfilename = await uploadImages(imageUri);
      console.log("Driver filename:", driverfilename);

      const response = await fetch(
        "https://quanlidoixe-p8k7.vercel.app/AddDriver",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...driver,
            license: JSON.stringify(driverfilename),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      console.log(data);

      Alert.alert("Success", "Tài xế đã được thêm.", [{ text: "OK" }]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Đã có lỗi xảy ra khi thêm tài xế. Vui lòng thử lại sau.",
        [{ text: "OK" }]
      );
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
              {startShow && (
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
              {endShow && (
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
              onPress={selectImage}
              style={{
                width: "90%",
                height: scale(20),
                bottom: scale(30),
                alignSelf: "center",
                backgroundColor: colors.Royalblue,
                justifyContent: "center", // Added this
                alignItems: "center", // And this
              }}
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
