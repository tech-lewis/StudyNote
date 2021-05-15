import React, { SFC } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import CommonIcon from "../../components/CommonIcon";
import CommonColors from "../../utils/CommonColors";

type Props = {
  iconName: string;
  title: string;
  onPress?: Function;
};

const Title: SFC<Props> = ({ iconName, title, onPress }) => {
  const touchable = !!onPress;
  return (
    <TouchableOpacity
      disabled={!touchable}
      onPress={() => {
        touchable && onPress();
      }}
    >
      <View style={style.wrapper}>
        <View style={style.content}>
          <CommonIcon
            size={14}
            color={CommonColors.primary}
            name={iconName}
          ></CommonIcon>
          <Text style={style.text}>{title}</Text>
        </View>
        {touchable ? <AntDesign name={"right"}></AntDesign> : null}
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  wrapper: {
    backgroundColor: CommonColors.white,
    height: 40,
    marginTop: 10,
    paddingHorizontal: 10,

    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  content: {
    flexDirection: "row"
  },
  text: { marginLeft: 6 }
});

export default Title;
