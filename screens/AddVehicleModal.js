import * as React from "react";
import {
  View,
  Text,
  Button,
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScaledSheet, s, scale } from "react-native-size-matters";
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

const AddVehicle = ({ isVisible, onClose }) => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState("Xe tải");
  const [imageUri, setImageUri] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [driver, setDriver] = React.useState("");
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [name, setName] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [size, setSize] = React.useState("");
  const [fuelType, setFuelType] = React.useState("");
  const [driverShow, setDriverShow] = React.useState(false);
  const [mode, setMode] = React.useState("date");
  const [show, setShow] = React.useState(false);
  const status = ["Đang hoạt động", "Bảo trì"];
  const options = ["Xe tải", "Xe khách", "Xe container"];
  const [selectstatus, setStatus] = React.useState("Tình trạng");
  const [drivers, setDrivers] = React.useState([]);
  const [driverName, setDriverName] = React.useState("");

  class Vehicle {
    constructor(name, option, driver, weight, size, fuelType, status) {
      this.name = name;
      this.option = option;
      this.driver = driver;
      this.weight = weight;
      this.size = size;
      this.fuelType = fuelType;
      this.status = status;
    }
  }

  const createVehicle = (
    name,
    option,
    driver,
    weight,
    size,
    fuelType,
    status
  ) => {
    return new Vehicle(name, option, driver, weight, size, fuelType, status);
  };

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
        const response = await fetch("http://10.0.2.2:8000/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

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
  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/GetDrivers");
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error(error);
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
  const submitVehicle = async () => {
    if (
      !name ||
      !selectedVehicle ||
      !driver ||
      !weight ||
      !size ||
      !fuelType ||
      !selectstatus ||
      !imageUri
    ) {
      Alert.alert("Missing fields", "Vui lòng điền đầy đủ thông tin.", [
        { text: "OK" },
      ]);
      return;
    }

    const vehicle = createVehicle(
      name,
      selectedVehicle,
      driver,
      weight,
      size,
      fuelType,
      selectstatus
    );

    console.log(vehicle);

    const driverfilename = await uploadImages(imageUri);
    console.log("Driver filename:", driverfilename);

    try {
      const response = await fetch("http://10.0.2.2:8000/AddVehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...vehicle,
          imageFileId: JSON.stringify(driverfilename),
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          Alert.alert(
            "Error",
            "Tài xế này đã được đăng ký cho phương tiện khác",
            [{ text: "OK" }]
          );
        } else {
          throw new Error("HTTP error " + response.status);
        }
        return;
      }

      const data = await response.json();
      console.log(data);

      Alert.alert("Success", "Phương tiện đã được thêm", [{ text: "OK" }]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Đã có lỗi xảy ra khi thêm phương tiện. Vui lòng thử lại sau.",
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
      fetchDrivers();
    }

    prepare();
  }, []);
  const renderDriver = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setDriver(item._id);
        setDriverName(item.name);
        setDriverShow(false);
      }}
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
    </TouchableOpacity>
  );

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
            onPress={() => setDriverShow(true)}
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
                Chọn tài xế
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
              {driverName}
            </Text>
            <Ionicons
              name="chevron-forward"
              style={{ left: scale(290), position: "absolute" }}
              size={scale(24)}
            ></Ionicons>
          </TouchableOpacity>
          <Modal visible={driverShow}>
            <FlatList
              data={drivers}
              keyExtractor={(item) => item._id}
              renderItem={renderDriver}
            />
          </Modal>
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
                top: scale(100),
                left: scale(10),
                width: "70%",
                fontSize: scale(14),
                fontFamily: "Roboto-Regular",
                color: colors.black,
              }}
              onChangeText={setName}
            ></TextInput>
            {/* <Text
              style={{ top: scale(150), left: scale(20), fontSize: scale(11) }}
            >
              Ex: Ford F-150
            </Text> */}
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "column" }}>
              <TextInput
                placeholder="Trọng lượng"
                placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
                keyboardType="ascii-capable"
                value={weight}
                style={{
                  ...styles.addinput,
                  top: scale(110),
                  left: scale(10),
                  width: scale(150),
                  fontSize: scale(14),
                  fontFamily: "Roboto-Regular",
                  color: colors.black,
                }}
                onChangeText={setWeight}
              ></TextInput>
              {/* <Text style={{ top: scale(150), left: scale(20) }}>1 tấn</Text> */}
            </View>
            <View style={{ flexDirection: "column" }}>
              <TextInput
                placeholder="Kích thước"
                placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
                keyboardType="ascii-capable"
                value={size}
                style={{
                  ...styles.addinput,
                  top: scale(110),
                  left: scale(30),
                  width: scale(150),
                  fontSize: scale(14),
                  fontFamily: "Roboto-Regular",
                  color: colors.black,
                }}
                onChangeText={setSize}
              ></TextInput>
              {/* <Text style={{ top: scale(150), left: scale(40) }}>
                1995 x 2030 x 6184 (mm)
              </Text> */}
            </View>
          </View>
          <View style={{ flexDirection: "row", top: scale(30) }}>
            <View style={{ flexDirection: "column" }}>
              <TextInput
                placeholder="Loại nhiên liệu"
                placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
                keyboardType="ascii-capable"
                value={fuelType}
                style={{
                  ...styles.addinput,
                  top: scale(90),
                  left: scale(10),
                  width: scale(150),
                  fontSize: scale(14),
                  fontFamily: "Roboto-Regular",
                  color: colors.black,
                }}
                onChangeText={setFuelType}
              ></TextInput>
              {/* <Text style={{ top: scale(150), left: scale(20) }}>
                {" "}
                87 octane
              </Text> */}
            </View>
            <TouchableOpacity
              style={{
                ...styles.addinput,
                top: scale(90),
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
            onPress={selectImage}
            style={{
              backgroundColor: colors.Royalblue,
              top: scale(150),
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
          <View style={{ flexDirection: "column" }}>
            <Text style={{ top: scale(170), left: scale(30) }}>Hình ảnh</Text>
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
                      bottom: scale(60),
                      top: scale(170),
                      left: scale(30),
                    }}
                  />
                ))}
            </View>
            <TouchableOpacity
              onPress={submitVehicle}
              style={{
                width: "90%",
                height: "20%",
                backgroundColor: colors.Royalblue,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                top: scale(190),
              }}
            >
              <Text style={{ color: "white" }}>Thêm phương tiện</Text>
            </TouchableOpacity>
          </View>
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
