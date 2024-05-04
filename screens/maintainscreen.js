import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// Screens
import Home from "./homepage";
import Fleet from "./fleets";
import Schedule from "./schedule";
import Profile from "./profile";
//Screen names
const homeName = "Home";
const fleet = "Fleet";
const schedule = "Schedule";
const profile = "Profile";

const Tab = createBottomTabNavigator();

function MaintainScreen({ route, navigation }) {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? "grid" : "grid-outline";
          } else if (rn === fleet) {
            iconName = focused ? "car-sport" : "car-sport-outline";
          } else if (rn === schedule) {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (rn === profile) {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1488D8",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: {
          paddingBottom: 10,
          fontSize: 10,
        },
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      })}
    >
      <Tab.Screen
        name={homeName}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={fleet}
        component={Fleet}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={schedule}
        component={Schedule}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={profile}
        options={{
          headerShown: false,
        }}
      >
        {(props) => <Profile {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default MaintainScreen;
