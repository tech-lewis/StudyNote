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
import CommonTag from "../../components/CommonTag";
import reactNavigationHelper from "../../utils/reactNavigationHelper";

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
        style={{
          marginHorizontal: 6
        }}
        name={iconName}
        size={16}
        color={CommonColors.gray}
      ></Ionicons>
    </View>
  );

  const pressHandle = (id: string) => {
    reactNavigationHelper.navigate("ReservationDetail", {
      reservationDetailId: id
    });
  };
  return (
    <FlatList
      ListHeaderComponent={Header}
      data={defaultDataList}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={() => (
        <Divider style={style.mainDivider}></Divider>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            pressHandle(item.id);
          }}
        >
          <View style={style.item}>
            <Image style={style.image} source={{ uri: item.imageUri }}></Image>
            <View style={style.contentWrapper}>
              <Text numberOfLines={1} style={style.title}>
                {item.title}
              </Text>
              <Text numberOfLines={2} style={style.subTitle}>
                {item.subTitle}
              </Text>
              <View style={style.footer}>
                <View style={style.tags}>
                  <CommonTag title={item.sex}></CommonTag>
                  <CommonTag title={item.age}></CommonTag>
                </View>
                <Button
                  buttonStyle={style.button}
                  titleStyle={style.buttonText}
                  title={"查看"}
                  onPress={() => {
                    pressHandle(item.id);
                  }}
                  linearGradientProps={{
                    colors: [
                      CommonColors.gradientStart,
                      CommonColors.gradientEnd
                    ],
                    start: { x: 0, y: 0.5 },
                    end: { x: 1, y: 0.5 }
                  }}
                ></Button>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
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
  },
  mainDivider: {
    marginVertical: 10
  },
  item: {
    flex: 1,
    flexDirection: "row",
    margin: 10,

    height: 90
  },
  image: {
    height: 90,
    width: 120,
    marginRight: 10
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
    height: 90,
    paddingRight: 10
  },
  title: {
    fontSize: 16,
    color: CommonColors.black,
    fontWeight: "600"
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: CommonColors.gray,
    minHeight: 40
  },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  tags: { flexDirection: "row" },
  button: { paddingVertical: 4, paddingHorizontal: 10 },
  buttonText: { fontSize: 10 }
});
ReservationListPage.navigationOptions = {
  title: "体检预约"
};
export default ReservationListPage;
