import React, { SFC } from "react";
import { View, Text, StyleSheet } from "react-native";
import _default from "react-navigation-stack/lib/typescript/views/Header/Header";

type Props = {
  title: string;
};
const CommonTag: SFC<Props> = ({ title }) => {
  return (
    <View style={style.wrapper}>
      <Text style={style.text}>{title}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  wrapper: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "pink",
    borderRadius: 2,

    paddingHorizontal: 4,
    paddingVertical: 1,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 6
  },
  text: {
    fontSize: 10,
    color: "red"
  }
});

export default CommonTag;
