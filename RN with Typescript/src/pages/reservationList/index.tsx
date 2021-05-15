import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";

import ModalDropDown from "react-native-modal-dropdown";
import { Button, Divider } from "react-native-elements";

//默认数据
const defaultDataList = [
  {
    title: "入职无忧套餐",
    subTitle: "基本检查，包含入职要求所有项目",
    imageUri:
      "https://wx1.sinaimg.cn/mw690/005SQLxwly1g9ey2fny93j306e050wf5.jpg",
    sex: "不限",
    age: "20-60",
    id: "login1"
  },
  {
    title: "浪漫七夕体检-青年版",
    subTitle: "七夕节新品--免费升级前列腺",
    imageUri:
      "https://wx3.sinaimg.cn/mw690/005SQLxwly1g9ey2fnqljj306e05074x.jpg",
    sex: "男",
    age: "20-40",
    id: "login2"
  },

  {
    title: "青年套餐A",
    subTitle:
      "针对青年人群 消化道疾病筛查 重要器官高清多普勒B超 肿瘤标志物检测",
    imageUri:
      "https://wx3.sinaimg.cn/mw690/005SQLxwly1g9ey2foa8fj306e05074y.jpg",
    sex: "不限",
    age: "20-40",
    id: "login3"
  },
  {
    title: "中老年套餐A",
    subTitle: "针对中老年人群 消化道器官检查 心脑血管疾病筛查...",
    imageUri:
      "https://wx3.sinaimg.cn/mw690/005SQLxwly1g9ey2fnhhkj306e0500t7.jpg",
    sex: "女",
    age: "30-70",
    id: "login4"
  }
];

//下拉下单选择项
const dropDownData = ["不限", "男", "女"];

//箭头名称
enum IconNames {
  "up" = "md-arrow-dropup",
  "down" = "md-arrow-dropdown"
}

const ReservationListPage = () => {
  return (
    <FlatList
      ListHeaderComponent={<Text>header</Text>}
      data={defaultDataList}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={() => <Divider></Divider>}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    ></FlatList>
  );
};

ReservationListPage.navigationOptions = {
  title: "体检预约"
};
export default ReservationListPage;
