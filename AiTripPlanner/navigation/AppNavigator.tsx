import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ExploreScreen from "../screens/ExploreScreen";

import BottomTabs from "./BottomTabs";

import CreateTripScreen from "../screens/CreateTripScreen";
import DestinationScreen from "../screens/DestinationScreen";
import DatesScreen from "../screens/DatesScreen";
import BudgetScreen from "../screens/BudgetScreen";
import InterestsScreen from "../screens/InterestsScreen";
import ReviewTripScreen from "../screens/ReviewTripScreen";
import TripDetailsScreen from "../screens/TripDetailsScreen";
import TripsScreen from "../screens/TripsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="WelcomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />

      <Stack.Screen name="MainTabs" component={BottomTabs} />

      <Stack.Screen name="CreateTripScreen" component={CreateTripScreen} />
      <Stack.Screen name="DestinationScreen" component={DestinationScreen} />
      <Stack.Screen name="DatesScreen" component={DatesScreen} />
      <Stack.Screen name="BudgetScreen" component={BudgetScreen} />
      <Stack.Screen name="InterestsScreen" component={InterestsScreen} />
      <Stack.Screen name="ReviewTripScreen" component={ReviewTripScreen} />
      <Stack.Screen name="TripDetailsScreen" component={TripDetailsScreen} />
      <Stack.Screen name="ExploreScreen" component={ExploreScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="TripsScreen" component={TripsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}