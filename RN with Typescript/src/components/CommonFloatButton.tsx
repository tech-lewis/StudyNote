import React, { SFC } from "react";
import { Button } from "react-native-elements";
import { StyleSheet } from "react-native";
import CommonColors from "../utils/CommonColors";

type Props = {
  title: string;
  onPress?: Function;
};

const CommonFloatButton: SFC<Props> = ({ title, onPress }) => {
  return (
    <Button
      buttonStyle={style.button}
      title={title}
      onPress={() => {
        onPress && onPress();
      }}
      linearGradientProps={{
        colors: [CommonColors.gradientStart, CommonColors.gradientEnd],
        start: { x: 0, y: 0.5 },
        end: { x: 1, y: 0.5 }
      }}
    ></Button>
  );
};

const style = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 40,

    width: "90%",
    left: "5%"
  }
});

export default CommonFloatButton;
