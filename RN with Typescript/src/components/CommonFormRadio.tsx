import React, { SFC } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import CommonFormItem from "./CommonFormItem";
import { Ionicons } from "@expo/vector-icons";
import CommonIcon from "./CommonIcon";
import CommonColors from "../utils/CommonColors";

type Props = {
  label: string;
  value: number;
  options: Array<string>;
  onChange?: (index: number) => void;
};

const CommonFormRadio: SFC<Props> = ({ label, value, options, onChange }) => {
  const itemRender = () => (
    <View style={style.wrapper}>
      {options.map((item, index) => (
        <TouchableOpacity key={index} style={style.content}>
          <Ionicons
            name={
              value === index ? "md-radio-button-on" : "md-radio-button-off"
            }
            size={16}
            color={CommonColors.primary}
          ></Ionicons>
          <Text style={style.text}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  return (
    <CommonFormItem label={label} renderItem={itemRender}></CommonFormItem>
  );
};

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  content: {
    flexDirection: "row"
  },
  text: { marginLeft: 4 }
});

export default CommonFormRadio;
