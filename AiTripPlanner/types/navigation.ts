export type RootStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  ForgotPasswordScreen: undefined;

  MainTabs: undefined;

  CreateTripScreen: undefined;
  DestinationScreen: undefined;
  DatesScreen: undefined;
  BudgetScreen: undefined;
  InterestsScreen: undefined;
  ReviewTripScreen: undefined;

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