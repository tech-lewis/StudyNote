import React, { SFC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import reactNavigationHelper from "../../../utils/reactNavigationHelper";
import getScreenWidth from "../../../utils/getScreenWidth";
import CommonIcon from "../../../components/CommonIcon";
import CommonColors from "../../../utils/CommonColors";

const dataList = [
  {
    title: "体检预约",
    subTitle: "实时预约",
    image: "59652",
    onTap: () => {
      reactNavigationHelper.navigate("ReservationList");
    }
  },
  {
    title: "报告查询",
    subTitle: "一键查询",
    image: "59700",
    onTap: () => {
      reactNavigationHelper.navigate("ReportList");
    }
  },
  {
    title: "健康评估",
    subTitle: "了解自身健康",
    image: "59660",
    onTap: null
  },
  {
    title: "健康干预",
    subTitle: "采集状况",
    image: "59661",
    onTap: null
  },
  {
    title: "健康档案",
    subTitle: "掌上查询",
    image: "59655",
    onTap: null
  },
  {
    title: "健康资讯",
    subTitle: "资讯一览",
    image: "59663",
    onTap: null
  }
];

const screenWidth = getScreenWidth();
const width = (screenWidth - 10 * 3) / 2;

const FunctionNavigate = () => {
  return (
    <View style={style.wrapper}>
      {dataList.map(item => (
        <TouchableOpacity
          key={item.title}
          onPress={() => {
            item.onTap && item.onTap();
          }}
        >
          <View style={style.itemWrapper}>
            <View>
              <Text style={style.title}>{item.title}</Text>
              <Text style={style.subTitle}>{item.subTitle}</Text>
            </View>
            <CommonIcon
              name={item.image}
              size={30}
              color={CommonColors.primary}
            ></CommonIcon>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  wrapper: {
    paddingTop: 10,
    paddingLeft: 10,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  itemWrapper: {
    width,
    backgroundColor: CommonColors.white,
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8
  },
  textWrapper: {},
  title: {
    color: CommonColors.black,
    fontSize: 16,
    height: 20
  },
  subTitle: {
    color: CommonColors.gray,
    fontSize: 12
  }
});

export default FunctionNavigate;
