import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const LoginPage = ({ navigation }) => {
  return (
    <View style={style.wrapper}>
      <Text>{"login"}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

//@ts-ignore
LoginPage.navigationOptions = {
  title: "登陆"
};
export default LoginPage;
