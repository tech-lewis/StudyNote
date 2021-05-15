import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import ReservationDetailPage from "./pages/reservationDetail";
import CommonColors from "./utils/CommonColors";
import ReservationListPage from "./pages/reservationList";
import ReservationSubmitPage from "./pages/ReservationSubmit";

const AppNavigator = createStackNavigator(
  {
    Home: HomePage,
    Login: LoginPage,
    ReservationDetail: ReservationDetailPage,
    ReservationList: ReservationListPage,
    ReservationSubmit: ReservationSubmitPage
  },
  {
    initialRouteName: "ReservationSubmit",
    defaultNavigationOptions: {
      headerTintColor: CommonColors.primary
    }
  }
);

export default AppNavigator;
