import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { BottomTabParamList } from "../types/navigation";
import { Colors } from "../constants/colors";

import ExploreScreen from "../screens/ExploreScreen";
import WishlistScreen from "../screens/WishlistScreen";
import TripsScreen from "../screens/TripsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="ExploreTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 18,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "compass-outline";

          if (route.name === "ExploreTab") {
            iconName = focused ? "compass" : "compass-outline";
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

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{ title: "Explore" }}
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