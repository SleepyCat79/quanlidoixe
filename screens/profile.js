import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserManager from "./UserManager"; // Import UserManager
import { ScaledSheet, scale } from "react-native-size-matters";
import { AuthContext } from "./AuthContext";

function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const { setIsUserLoggedIn } = React.useContext(AuthContext);

  useEffect(() => {
    async function fetchUser() {
      // Using UserManager to fetch user data
      const userData = await UserManager.getInstance().loadUser();
      setUser(userData);
      setUserLoaded(true); // Indicating that the user data is ready
    }

    fetchUser();
  }, []);

  if (!userLoaded) {
    return null; // Optionally show a loading indicator here
  }
  const logout = async () => {
    await UserManager.getInstance().logOut();

    setIsUserLoggedIn(false); // Update the isUserLoggedIn state
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.usernameText}>
        Tên người dùng: {user ? user.name : "N/A"}
      </Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  usernameText: {
    fontFamily: "Roboto-Bold",
    fontSize: scale(20),
  },
});

export default Profile;
