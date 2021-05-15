import * as React from "react";
import { createIconSet } from "@expo/vector-icons";
import constant from "../constant";
// 59648 66
const fontCodeStart = 59648;
const fontCount = 66;
const glyphMap = Array.from(
  { length: fontCount },
  (_item, index) => fontCodeStart + index
).reduce((pre, cur) => {
  pre[cur] = cur;
  return pre;
}, {});
const expoAssetId = require("./../../assets/fonts/health-icon.ttf");
const CommonIcon = createIconSet(glyphMap, constant.healthIcon, expoAssetId);

export default CommonIcon;
