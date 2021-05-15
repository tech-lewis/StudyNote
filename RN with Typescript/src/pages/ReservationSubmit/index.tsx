import React, { SFC } from "react";

import { View, ScrollView, StyleSheet, Text } from "react-native";
import CommonFloatButton from "../../components/CommonFloatButton";
import ReservationHeader from "../../components/ReservationHeader";
import CommonColors from "../../../src/utils/CommonColors";
import CommonTitle from "../../components/CommonTitle";

const ReservationSubmitPage = () => {
  return (
    <View style={style.wrapper}>
      <ScrollView>
        <ReservationHeader></ReservationHeader>
        <View style={style.content}>
          <CommonTitle title={"体检人信息"}></CommonTitle>
        </View>
      </ScrollView>
      <CommonFloatButton title={"提交"}></CommonFloatButton>
    </View>
  );
};

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: CommonColors.lineGray
  },
  content: {
    marginTop: 10,
    paddingBottom: 80,
    backgroundColor: CommonColors.white,
    paddingHorizontal: 10
  }
});

ReservationSubmitPage.navigationOptions = {
  title: "体检提交"
};

export default ReservationSubmitPage;
