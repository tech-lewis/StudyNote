import React, { SFC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
type Props = { title: string };

const CommonTitle: SFC<Props> = ({ title }) => {
  return (
    <View style={style.wrapper}>
      <Text style={style.text}>{title}</Text>
      <Ionicons name={"ios-arrow-forward"} size={20}></Ionicons>
    </View>
  );
};
const style = StyleSheet.create({
  wrapper: {
    height: 30,
    marginVertical: 20,

    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    marginRight: 6
  }
});

export default CommonTitle;
