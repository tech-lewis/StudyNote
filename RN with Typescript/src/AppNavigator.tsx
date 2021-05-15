import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import ReservationDetailPage from "./pages/reservationDetail";
import CommonColors from "./utils/CommonColors";

const AppNavigator = createStackNavigator(
  {
    Home: HomePage,
    Login: LoginPage,
    ReservationDetail: ReservationDetailPage
  },
  {
    defaultNavigationOptions: {
      headerTintColor: CommonColors.primary
    }
  }
);

export default AppNavigator;
