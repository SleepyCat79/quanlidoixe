import * as React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Profile() {
  const navigation = useNavigation();

  const logout = async () => {
    // Clear user data from AsyncStorage
    await AsyncStorage.removeItem("user");
    // Navigate to SignUp screen
    navigation.navigate("SignIn");
  };

  return (
    <View>
      <Text>Profile</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

export default Profile;
