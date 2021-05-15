import React, { SFC } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";

type Props = {
  navigation: NavigationStackProp<any, { reservationDetailId: string }>;
};
const ReservationDetailPage: SFC<Props> = ({ navigation }) => {
  const id = navigation.getParam("reservationDetailId", "1");
  return (
    <View style={style.wrapper}>
      <Text>{`这里是体检预约${id}`}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
//@ts-ignore
ReservationDetailPage.navigationOptions = {
  title: "预约详情"
};
export default ReservationDetailPage;
