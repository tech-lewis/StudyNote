import React, { SFC, useState } from "react";

import { View, ScrollView, StyleSheet, Text } from "react-native";
import CommonFloatButton from "../../components/CommonFloatButton";
import ReservationHeader from "../../components/ReservationHeader";
import CommonColors from "../../../src/utils/CommonColors";
import CommonTitle from "../../components/CommonTitle";
import CommonFormItem from "../../components/CommonFormItem";
import CommonFormRadio from "../../components/CommonFormRadio";

const ReservationSubmitPage = () => {
  return (
    <View style={style.wrapper}>
      <ScrollView>
        <ReservationHeader></ReservationHeader>
        <View style={style.content}>
          <CommonTitle title={"体检人信息"}></CommonTitle>
          <CommonFormItem
            label={"体检人"}
            textInputPlaceholder={"请输入体检人姓名"}
          ></CommonFormItem>
          <CommonFormItem
            label={"手机号"}
            textInputPlaceholder={"请输入手机号"}
          ></CommonFormItem>
          <CommonFormItem
            label={"身份证号"}
            textInputPlaceholder={"请输入身份证号"}
          ></CommonFormItem>
          <CommonFormRadio
            label={"性别"}
            value={0}
            options={["男", "女"]}
          ></CommonFormRadio>
          <CommonFormRadio
            label={"婚否"}
            value={0}
            options={["未婚", "已婚"]}
          ></CommonFormRadio>
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
