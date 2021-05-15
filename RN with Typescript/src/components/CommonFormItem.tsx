import React, { SFC } from "react";
import { View, StyleSheet, Text, ViewStyle, StyleProp } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import CommonColors from "../../src/utils/CommonColors";

type Props = {
  label: string;
  renderItem?: () => JSX.Element;

  textInputValue?: string;
  textInputOnChangeText?: (text: string) => void;
  textInputPlaceholder?: string;
  textInputSecureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  showDivider?: boolean;
};

const CommonFormItem: SFC<Props> = ({
  label,
  renderItem,

  textInputValue = "",
  textInputOnChangeText,
  textInputPlaceholder = "",
  textInputSecureTextEntry = false,
  style = {},
  showDivider = true
}) => {
  return (
    <View style={[defaultStyle.wrapper, style]}>
      <View style={defaultStyle.label}>
        <Text style={defaultStyle.text}>{label}</Text>
      </View>
      <View style={defaultStyle.content}>
        {renderItem ? (
          renderItem()
        ) : (
          <TextInput
            placeholder={textInputPlaceholder}
            value={textInputValue}
            onChangeText={textInputOnChangeText}
            secureTextEntry={textInputSecureTextEntry}
          ></TextInput>
        )}
      </View>
    </View>
  );
};

const defaultStyle = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    height: 30,
    marginBottom: 20,

    borderBottomWidth: 1,
    borderBottomColor: CommonColors.lineGray
  },
  label: { width: 100 },

  text: {},
  content: {
    flex: 1,
    height: 20
  }
});

export default CommonFormItem;
