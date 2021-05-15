import React, { SFC } from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import { Button, Divider } from "react-native-elements";
import CommonColors from "../../utils/CommonColors";
import ReservationHeader from "../../components/ReservationHeader";
import Title from "./Title";
import constant from "../../constant";
type Props = {
  navigation: NavigationStackProp<any, { reservationDetailId: string }>;
};
const items = [
  {
    name: "一般检查",
    content: "身高 体重 体重指数 收缩压 舒张压",
    construction: "了解身体基本信息判断是否肥胖、超重"
  },
  {
    name: "一般检查1",
    content: "身高 体重 体重指数 收缩压 舒张压",
    construction: "了解身体基本信息判断是否肥胖、超重"
  }
];
const ReservationDetailPage: SFC<Props> = ({ navigation }) => {
  const id = navigation.getParam("reservationDetailId", "1");
  return (
    <View style={style.outWrapper}>
      <ScrollView style={style.wrapper}>
        <ReservationHeader></ReservationHeader>
        <Title
          title={"预约须知"}
          iconName={"59668"}
          onPress={() => {
            Linking.openURL(constant.reservationNotiveUri);
          }}
        ></Title>
        <Title title={"套餐详情"} iconName={"59652"}></Title>
        <View style={style.table}>
          <View style={style.tableHeader}>
            <View style={[style.tableHeaderItem, { flexGrow: 3 }]}>
              <Text>项目名称</Text>
            </View>
            <Divider style={style.tableHeaderDivider}></Divider>
            <View style={[style.tableHeaderItem, { flexGrow: 4 }]}>
              <Text>项目内容</Text>
            </View>
            <Divider style={style.tableHeaderDivider}></Divider>
            <View style={[style.tableHeaderItem, { flexGrow: 3 }]}>
              <Text>项目解读</Text>
            </View>
          </View>
          <View style={style.tableContent}>
            {items.map(item => (
              <View key={item.name} style={style.tableContentItem}>
                <View style={[style.tableContentCell, { flexGrow: 3 }]}>
                  <Text style={style.contentText}>{item.name}</Text>
                </View>
                <View style={[style.tableContentCell, { flexGrow: 4 }]}>
                  <Text style={style.contentText}>{item.content}</Text>
                </View>
                <View style={[style.tableContentCell, { flexGrow: 3 }]}>
                  <Text style={style.contentText}>{item.construction}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <Button title={"立即预约"}></Button>
    </View>
  );
};

const style = StyleSheet.create({
  outWrapper: {
    flex: 1
  },
  wrapper: {
    flex: 1,
    backgroundColor: CommonColors.lineGray
  },
  table: {
    marginTop: 1,
    marginBottom: 80,
    backgroundColor: CommonColors.white,
    padding: 10
  },
  tableHeader: {
    flexDirection: "row",
    height: 40,
    alignItems: "center"
  },
  tableHeaderDivider: {
    width: 0,
    height: 20,
    borderRightColor: CommonColors.lineGray,
    borderRightWidth: 1
  },
  tableHeaderItem: {
    flexBasis: 0,
    alignItems: "center"
  },
  tableContent: {},
  tableContentItem: {
    marginTop: 1,
    flexDirection: "row",
    paddingVertical: 6
  },
  tableContentCell: {
    flexBasis: 0,
    justifyContent: "center",
    padding: 5
  },
  contentText: {
    color: CommonColors.gray,
    fontSize: 12,
    lineHeight: 18
  }
});
//@ts-ignore
ReservationDetailPage.navigationOptions = {
  title: "预约详情"
};
export default ReservationDetailPage;
