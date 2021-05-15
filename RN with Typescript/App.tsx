import React, { useRef, useEffect } from "react";
import { View, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import AppNavigator from "./src/AppNavigator";
import reactNavigationHelper from "./src/utils/reactNavigationHelper";
import * as Font from "expo-font";
import constant from "./src/constant";

const Container = createAppContainer(AppNavigator);
const App = () => {
  const _ref = useRef(null);
  useEffect(() => {
    reactNavigationHelper.setNavigatorRef(_ref);
    Font.loadAsync({
      [constant.healthIcon]: require("./assets/fonts/health-icon.ttf")
    });
  }, []);
  return <Container ref={_ref}></Container>;
};

export default App;
