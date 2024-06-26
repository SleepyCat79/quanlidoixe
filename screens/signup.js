import * as React from "react";
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

function SignUp() {
  const [Email, setEmail] = React.useState(null);
  const [visible, setvisible] = React.useState(false);
  const navigation = useNavigation();

  const [password, setPassword] = React.useState(null);
  const [passwordagain, setPasswordagain] = React.useState("");
  const [name, setName] = React.useState(null);
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const handleSignUp = async () => {
    if (!name || !Email || !password) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch(
        "https://quanlidoixe-p8k7.vercel.app/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: Email,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422) {
          alert("Tài khoản đã tồn tại");
        } else {
          throw new Error(
            `HTTP status ${response.status}, data: ${JSON.stringify(errorData)}`
          );
        }
      } else {
        alert("Đăng ký thành công");
      }
    } catch (error) {
      console.error("Failed to sign up:", error);
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

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

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

        <View style={[styles.inputn]}>
          <TextInput
            style={[styles.textClr]}
            placeholder="Kimi no nawa?"
            keyboardType="ascii-capable"
            value={name}
            onChangeText={setName}
          />
          <View style={[styles.label, styles.orFlexBox]}>
            <Text style={[styles.email, styles.emailTypo]}>Name</Text>
          </View>
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
              value={passwordagain}
              onChangeText={setPasswordagain}
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
          <TouchableOpacity
            style={{ top: scale(36), left: scale(150) }}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={{ color: "#429690", fontFamily: "Roboto-Regular" }}>
              Đã có tài khoản?
            </Text>
          </TouchableOpacity>
        </View>
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
          onPress={() => handleSignUp()}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Đăng Ký</Text>
        </TouchableOpacity>
        <View style={{ top: scale(15) }}>
          <Text
            style={{
              fontSize: scale(27),
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

export default SignUp;
