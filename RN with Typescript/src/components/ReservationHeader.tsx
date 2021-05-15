import React, { SFC } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import ReservationDetailPage from "../pages/reservationDetail/index";
import CommonTag from "./CommonTag";
import getScreenWidth from "../utils/getScreenWidth";
import CommonColors from "../utils/CommonColors";
const uri =
  "https://tva1.sinaimg.cn/large/006tNbRwly1g9i8rogg6tj30bo09mt9l.jpg";

const imageRatio = 420 / 346;
const imageWidth = getScreenWidth();
const imageHeight = imageWidth / imageRatio;
const defaultData = {
  image: uri,
  title: "珍爱高端升级肿瘤12项筛查（男女单人）",
  subTitle:
    "本套餐是一款针对生化五项检查，心，肝，胆，胃，甲状腺，颈椎，肺功能，脑部检查（经颅多普勒）以及癌症筛查，适合大众人群体检的套餐",
  sex: "女",
  age: "20-70"
};
type Props = { data?: typeof defaultData };
const ReservationHeader: SFC<Props> = ({ data = defaultData }) => {
  return (
    <View style={style.wrapper}>
      <Image style={style.image} source={{ uri: data.image }}></Image>
      <View style={style.titleWrapper}>
        <Text style={style.title}>{data.title}</Text>
        <Text style={style.subTitle}>{data.subTitle}</Text>
        <View style={style.tagWrapper}>
          <CommonTag title={data.sex}></CommonTag>
          <CommonTag title={data.age}></CommonTag>
        </View>
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  wrapper: { backgroundColor: CommonColors.white },
  image: { width: imageWidth, height: imageHeight },
  titleWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  title: {
    fontSize: 16,
    color: CommonColors.black
  },
  subTitle: {
    fontSize: 12,
    lineHeight: 18,
    color: CommonColors.gray,
    marginVertical: 10
  },
  tagWrapper: {
    flexDirection: "row",
    height: 20
  }
});
export default ReservationHeader;
