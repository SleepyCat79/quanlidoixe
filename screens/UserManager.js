// UserManager.js
import AsyncStorage from "@react-native-async-storage/async-storage";

class UserManager {
  static instance = null;
  user = null;

  static getInstance() {
    if (UserManager.instance === null) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  async loadUser() {
    const userData = await AsyncStorage.getItem("user");
    this.user = userData ? JSON.parse(userData) : null;
    return this.user;
  }

  async setUser(user) {
    this.user = user;
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }

  async logOut() {
    this.user = null;
    await AsyncStorage.removeItem("user");
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return !!this.user;
  }
}

export default UserManager;
