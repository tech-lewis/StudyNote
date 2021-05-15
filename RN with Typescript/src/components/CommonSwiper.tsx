import React, { SFC } from "react";
import { View, Image, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

import getScreenWidth from "../utils/getScreenWidth";

const defautImages = [
  "https://tva1.sinaimg.cn/large/006y8mN6ly1g9bk8d7e7ej30ku09q77w.jpg",
  "https://tva1.sinaimg.cn/large/006y8mN6ly1g9bk851wr6j30ku09qq74.jpg",
  "https://tva1.sinaimg.cn/large/006y8mN6ly1g9bk87v2x8j30ku09qq46.jpg"
];
// 图片宽750px，高424px；
const imageWidth = 750.0;
const imageHeight = 350.0;

const width = getScreenWidth();
const height = (width * imageHeight) / imageWidth;

const style = StyleSheet.create({
  size: { width, height }
});

type Props = {
  images?: string[];
};

const CommonSwiper: SFC<Props> = ({ images = defautImages }) => {
  return (
    <View style={style.size}>
      <Swiper autoplay={true}>
        {images.map(item => (
          <Image key={item} source={{ uri: item }} style={style.size}></Image>
        ))}
      </Swiper>
    </View>
  );
};

export default CommonSwiper;
