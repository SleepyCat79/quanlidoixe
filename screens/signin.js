import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import colors from "../assets/colors/color";
import { Ionicons } from "@expo/vector-icons";
import UserManager from "./UserManager"; // Import the UserManager
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Padding, Border } from "../assets/globalstyle";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ScaledSheet, scale } from "react-native-size-matters";

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

function SignIn() {
  const [Email, setEmail] = React.useState(null);
  const [visible, setvisible] = React.useState(false);
  const navigation = useNavigation();
  const [password, setPassword] = React.useState(null);
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const handleSignIn = async () => {
    if (!Email || !password) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch(
        "https://quanlidoixe-p8k7.vercel.app/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: Email, password: password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể đăng nhập");
      }

      // Use UserManager to handle user data
      await UserManager.getInstance().setUser(data);

      // Navigate to the next screen after successful login
      navigation.reset({
        index: 0,
        routes: [{ name: "MaintainScreen" }],
      });
    } catch (error) {
      alert(
        "Sai tài khoản hoặc mật khẩu",
        error.message || "Đăng nhập thất bại"
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
      <SafeAreaView
        style={{
          backgroundColor: colors.gradient,
          width: "100%",
          height: "100%",
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: colors.gradient,
            width: "100%", // or a specific number
            height: "30%", // or a specific number
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={[styles.logotext]}>BK FLEET{"    "}</Text>
          <Image
            source={require("../assets/images/logonk.png")}
            style={styles.logo}
          />
        </View>

        <View style={[styles.inputn, { margin: scale(10) }]}>
          <TextInput
            style={[styles.textClr]}
            placeholder="Nhập địa chỉ email"
            keyboardType="email-address"
            value={Email}
            onChangeText={setEmail}
          />
          <View style={[styles.label, styles.orFlexBox]}>
            <Text style={[styles.email, styles.emailTypo]}>Email</Text>
          </View>
        </View>
        <View
          style={[
            styles.input1,
            { borderColor: colors.colorGray, margin: scale(10) },
          ]}
        >
          <View>
            <TextInput
              style={[styles.textClr]}
              placeholder="Mật khẩu"
              secureTextEntry={!isPasswordVisible} // hide text input if isPasswordVisible is false
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={{ left: scale(270), position: "absolute" }}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={scale(20)}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{ top: scale(0), left: scale(220) }}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={{ color: "#429690", fontFamily: "Roboto-Regular" }}>
            Chưa có tài khoản?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignSelf: "center",
            height: scale(60),
            backgroundColor: colors.Royalblue,
            width: scale(200),
            marginTop: scale(30),
            borderRadius: scale(30),
            justifyContent: "center",
          }}
          onPress={() => handleSignIn()}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Đăng Nhập</Text>
        </TouchableOpacity>
        <View style={{ top: scale(75) }}>
          <Text
            style={{
              fontSize: scale(37),
              textAlign: "center",
              fontFamily: "Roboto-Bold",
            }}
          >
            Hệ Thống{"\n"} Quản Lí Đội Xe
          </Text>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const styles = ScaledSheet.create({
  logotext: {
    color: colors.Royalblue,
    fontSize: 40,
    fontFamily: "Roboto-Bold",
  },
  label: {
    top: -10,
    left: 12,
    paddingHorizontal: 4,
    paddingVertical: 0,
    zIndex: 2,
    backgroundColor: colors.gradient,
    flexDirection: "row",
  },
  emailTypo: {
    fontFamily: "Inter-Medium",
    fontWeight: "500",
  },
  email: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.Royalblue,
    textAlign: "left",
  },
  textClr: {
    color: colors.colorGray,
    textAlign: "left",
  },

  inputn: {
    borderColor: colors.Royalblue,
    borderWidth: 1.5,
    width: wp("90%"),
    height: hp("6.5%"),
    borderRadius: Border.br_3xs,
    padding: Padding.p_base,
    borderStyle: "solid",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
  },

  input1: {
    borderColor: colors.Royalblue,
    borderWidth: 0.5,
    width: wp("90%"),
    borderRadius: Border.br_3xs,
    height: hp("6.5%"),
    padding: Padding.p_base,
    borderStyle: "solid",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
  },
  orFlexBox: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    color: "black",
    fontSize: 24,
  },
});

export default SignIn;
