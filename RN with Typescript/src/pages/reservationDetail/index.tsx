import React, { SFC } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import { Button } from "react-native-elements";
import CommonColors from "../../utils/CommonColors";
type Props = {
  navigation: NavigationStackProp<any, { reservationDetailId: string }>;
};
const ReservationDetailPage: SFC<Props> = ({ navigation }) => {
  const id = navigation.getParam("reservationDetailId", "1");
  return (
    <View style={style.outWrapper}>
      <ScrollView style={style.wrapper}>
        <Text>Header</Text>
        <Text>Notice</Text>
        <View style={style.content}>
          <Text>contentHeader</Text>
          <Text>Table</Text>
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
  content: {}
});
//@ts-ignore
ReservationDetailPage.navigationOptions = {
  title: "预约详情"
};
export default ReservationDetailPage;
