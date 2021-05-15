import React, { SFC } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import reactNavigationHelper from "../../utils/reactNavigationHelper";
import CommonColors from "../../utils/CommonColors";

type Props = {
  navigation: NavigationStackProp;
};
const HomePage: SFC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={style.wrapper}>
      <Text>轮播图--swiper</Text>
      <Text>功能导航— Functions</Text>
      <Text>广告— Image</Text>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: CommonColors.backgroudGray
  }
});

//@ts-ignore
HomePage.navigationOptions = {
  title: "猿健康"
};
export default HomePage;
