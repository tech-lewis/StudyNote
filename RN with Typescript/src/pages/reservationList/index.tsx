import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ModalDropDown from "react-native-modal-dropdown";
import { Button, Divider } from "react-native-elements";
import CommonColors from "../../utils/CommonColors";

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
  const [iconName, setIconName] = useState(IconNames.down);
  const Header = (
    <View style={style.wrapper}>
      <Text style={style.text}>性别</Text>
      <Divider style={style.divider}></Divider>
      <ModalDropDown
        onDropdownWillShow={() => {
          setIconName(IconNames.up);
          return true;
        }}
        onDropdownWillHide={() => {
          setIconName(IconNames.down);
          return true;
        }}
        options={dropDownData}
        defaultValue={dropDownData[0]}
        onSelect={() => {}}
        dropdownStyle={{ height: 105 }}
        adjustFrame={styleObj => {
          styleObj.top += 12;
          return styleObj;
        }}
        dropdownTextStyle={{ fontSize: 14 }}
        textStyle={{ fontSize: 16, color: CommonColors.gray }}
      ></ModalDropDown>
      <Ionicons
        style={{ marginHorizontal: 6 }}
        name={iconName}
        size={16}
        color={CommonColors.gray}
      ></Ionicons>
    </View>
  );
  return (
    <FlatList
      ListHeaderComponent={Header}
      data={defaultDataList}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={() => <Divider></Divider>}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    ></FlatList>
  );
};
const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",

    borderBottomWidth: 1,
    borderBottomColor: CommonColors.lineGray,

    height: 40,
    padding: 10,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: CommonColors.black
  },
  divider: {
    height: 22,
    width: 1,
    borderLeftColor: CommonColors.lineGray,
    marginHorizontal: 20
  }
});
ReservationListPage.navigationOptions = {
  title: "体检预约"
};
export default ReservationListPage;
