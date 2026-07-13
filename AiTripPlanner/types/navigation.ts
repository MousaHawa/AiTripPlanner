import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  ForgotPasswordScreen: undefined;


  CreateTripScreen: undefined;
  ExploreScreen: undefined;
  DestinationScreen: undefined;
  DatesScreen: undefined;
  BudgetScreen: undefined;
  InterestsScreen: undefined;
  ReviewTripScreen: {
    trip: {
      destination: string;
      startDate: string;
      endDate: string;
      budget: string;
      travelers: string;
      tripType: string | string[];

      summary?: string;
      totalDays?: number;
      estimatedCost?: string;
      dailyPlan?: any[];
      hotels?: any[];
      hotelSuggestions?: any[];
      restaurants?: any[];
      tips?: string[];

      [key: string]: any;
    };
  };
};

  TripDetailsScreen: {
    tripId: string;
  };
};

export type BottomTabParamList = {
  ExploreTab: undefined;
  WishlistTab: undefined;
  TripsTab: undefined;
  ProfileTab: undefined;
};