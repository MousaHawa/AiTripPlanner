import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { BottomTabParamList } from "../types/navigation";

import HomeScreen from "../screens/HomeScreen";
import WishlistScreen from "../screens/WishlistScreen";
import TripsScreen from "../screens/TripsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ExploreScreen from "../screens/ExploreScreen";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#FDE68A",
        tabBarInactiveTintColor: "#C4B5FD",

        tabBarStyle: {
          height: 84,
          paddingTop: 10,
          paddingBottom: 18,
          marginHorizontal: 18,
          marginBottom: 18,
          borderRadius: 28,
          position: "absolute",
          backgroundColor: "rgba(30, 27, 75, 0.92)",
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.18)",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 18,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          elevation: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "900",
        },

        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "compass-outline";

          if (route.name === "ExploreTab") {
            iconName = focused ? "home" : "home-outline";
          }

          if (route.name === "WishlistTab") {
            iconName = focused ? "heart" : "heart-outline";
          }

          if (route.name === "TripsTab") {
            iconName = focused ? "briefcase" : "briefcase-outline";
          }

          if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused
                  ? "rgba(253, 230, 138, 0.16)"
                  : "transparent",
                borderWidth: focused ? 1 : 0,
                borderColor: focused
                  ? "rgba(253, 230, 138, 0.35)"
                  : "transparent",
              }}
            >
              <Ionicons
                name={iconName}
                size={focused ? 25 : 22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Home" }}
      />

      <Tab.Screen
        name="WishlistTab"
        component={WishlistScreen}
        options={{ title: "Wishlist" }}
      />

      <Tab.Screen
        name="TripsTab"
        component={TripsScreen}
        options={{ title: "Trips" }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}