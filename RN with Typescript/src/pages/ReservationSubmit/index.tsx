import React, { SFC } from "react";

import { View, ScrollView, StyleSheet, Text } from "react-native";
import CommonFloatButton from "../../components/CommonFloatButton";
import ReservationHeader from "../../components/ReservationHeader";
import CommonColors from "../../../src/utils/CommonColors";

const ReservationSubmitPage = () => {
  return (
    <View style={style.wrapper}>
      <ScrollView>
        <ReservationHeader></ReservationHeader>
        <View style={style.content}></View>
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
  content: {}
});

ReservationSubmitPage.navigationOptions = {
  title: "体检提交"
};

export default ReservationSubmitPage;
