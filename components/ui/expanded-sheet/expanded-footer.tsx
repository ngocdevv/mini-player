import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DynamicTabIndicator } from "../dynamic-tabs";
import { MiniPlayerHeight } from "./constants";

interface ExpandedFooterProps {
  progressShared: SharedValue<number>;
}
const windowHeight = Dimensions.get("screen").height;
export const ExpandedFooter = ({ progressShared }: ExpandedFooterProps) => {
  const safeTop = useSafeAreaInsets().top;

  const rSheetDefaultStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        progressShared.value,
        [0, 1, 2],
        [0, MiniPlayerHeight + 50, windowHeight]
      ),
      opacity: interpolate(progressShared.value, [0, 1, 2], [0, 1, 1]),
      paddingTop: interpolate(
        progressShared.value,
        [0, 1, 2],
        [0, 0, MiniPlayerHeight + safeTop]
      ),
    };
  });
  const rTabBarStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progressShared.value, [0, 1, 2], [0, 1, 1]),
      backgroundColor: interpolateColor(
        progressShared.value,
        [0, 1, 2],
        ["transparent", "transparent", "#000"]
      ),
      borderTopLeftRadius: interpolate(
        progressShared.value,
        [0, 1, 2],
        [0, 0, 16]
      ),
      borderTopRightRadius: interpolate(
        progressShared.value,
        [0, 1, 2],
        [0, 0, 16]
      ),
    };
  });

  return (
    <Animated.View style={[styles.container, rSheetDefaultStyle]}>
      <Animated.View style={[{ flex: 1 }, rTabBarStyle]}>
        <DynamicTabIndicator progress={progressShared} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1100,
  },
});
