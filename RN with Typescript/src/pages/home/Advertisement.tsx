import React from "react";
import { Image, StyleSheet } from "react-native";
import getScreenWidth from "../../utils/getScreenWidth";

const uri =
  "https://tva1.sinaimg.cn/large/006y8mN6ly1g9bjwmyya5j30ku07377e.jpg";
const imageRatio = 750 / 255;

const height = getScreenWidth() / imageRatio;

const Advertisement = () => (
  <Image source={{ uri }} style={style.image}></Image>
);

const style = StyleSheet.create({
  image: {
    width: "100%",
    height
  }
});

export default Advertisement;
