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
import { ScaledSheet, scale } from "react-native-size-matters";
import colors from "../assets/colors/color";
import { Padding, Border } from "../assets/globalstyle";
import { Picker } from "@react-native-picker/picker";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
const AddDriverModal = ({ isVisible, onClose }) => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("Còn hạn");

  const [name, setName] = React.useState("");
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
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        flexDirection: "column",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity title="Close" onPress={onClose}>
          <Ionicons
            name="close-sharp"
            size={scale(36)}
            style={{ top: scale(46), left: scale(10) }}
          />
        </TouchableOpacity>
        <Text
          style={{
            top: scale(48),
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
            top: scale(100),
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
            value={name}
            style={{
              ...styles.addinput,
              top: scale(130),
              width: "20%",
              alignSelf: "flex-start",
              left: scale(20),
              fontSize: scale(14),
              fontFamily: "Roboto-Regular",
              color: colors.black,
            }}
            onChangeText={setName}
          ></TextInput>
          <TextInput
            placeholder="Kinh nghiệm hành nghề"
            placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
            keyboardType="phone-pad"
            value={name}
            style={{
              ...styles.addinput,
              top: scale(130),
              left: scale(40),
              width: "64%",
              fontSize: scale(14),
              fontFamily: "Roboto-Regular",
              color: colors.black,
            }}
            onChangeText={setName}
          ></TextInput>
        </View>
        <TextInput
          placeholder="Địa chỉ"
          placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
          keyboardType="ascii-capable"
          value={name}
          style={{
            ...styles.addinput,
            top: scale(160),
            fontSize: scale(14),
            fontFamily: "Roboto-Regular",
            color: colors.black,
          }}
          onChangeText={setName}
        ></TextInput>
        <TextInput
          placeholder="Số điện thoại"
          placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
          keyboardType="phone-pad"
          value={name}
          style={{
            ...styles.addinput,
            top: scale(190),
            fontSize: scale(14),
            fontFamily: "Roboto-Regular",
            color: colors.black,
          }}
          onChangeText={setName}
        ></TextInput>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            placeholder="Bằng cấp lái xe"
            placeholderTextColor="rgba(0, 0, 0, 0.75)" // Adjust the last value for opacity
            keyboardType="ascii-capable"
            value={name}
            style={{
              ...styles.addinput,
              top: scale(210),
              width: "50%",
              alignSelf: "flex-start",
              left: scale(20),
              fontSize: scale(14),
              fontFamily: "Roboto-Regular",
              color: colors.black,
            }}
            onChangeText={setName}
          ></TextInput>
          <Picker
            selectedValue={selectedValue}
            style={{
              top: scale(210),
              left: scale(40),
              height: scale(50),
              width: scale(160),
              borderColor: "black",
              borderWidth: 1.5,
            }}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
          >
            <Picker.Item label="Còn hạn" value="Còn hạn" />
            <Picker.Item label="Hết hạn" value="Hết hạn" />
          </Picker>
        </View>
      </View>
    </View>
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
