import * as React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScaledSheet, scale } from "react-native-size-matters";

function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = React.useState(null);
  const [userLoaded, setUserLoaded] = React.useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      setUser(userData);
      setUserLoaded(true); // Set userLoaded to true after the user data is set
    };

    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
      } catch (e) {}

      fetchUser();
    }

    prepare();
  }, []);
  if (!userLoaded) {
    return null; // Or return a loading spinner
  }

  const logout = async () => {
    // Clear user data from AsyncStorage
    await AsyncStorage.removeItem("user");
    // Navigate to SignUp screen
    navigation.navigate("SignIn");
  };

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontFamily: "Roboto-Bold", fontSize: scale(20) }}>
        Tên người dùng: {user.name}
      </Text>
      <View style={{}}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}

export default Profile;
