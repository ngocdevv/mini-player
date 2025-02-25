import { EasingsUtils } from "@/constants/easings";
import { PressableScale } from "pressto";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { IconSymbol } from "../IconSymbol";

type TabItemProps = {
  screen: string;
  opacity?: number;
  focused: boolean;
  onPress: () => void;
};

export const TabItem = ({
  screen,
  opacity = 1,
  focused,
  onPress,
}: TabItemProps) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(focused ? 0.8 * opacity : 0.2 * opacity, {
        easing: EasingsUtils.inOut,
      }),
    };
  }, [focused, opacity]);

  const Icon = useCallback(() => {
    switch (screen) {
      case "index":
        return <IconSymbol size={28} name="house.fill" color={"#ffffff"} />;
      case "music":
        return (
          <IconSymbol size={28} name="music.house.fill" color={"#ffffff"} />
        );
      case "library":
        return (
          <IconSymbol
            size={28}
            name="apple.image.playground.fill"
            color={"#ffffff"}
          />
        );
      case "explore":
        return (
          <IconSymbol size={28} name="paperplane.fill" color={"#ffffff"} />
        );
      default:
        return null;
    }
  }, [screen]);

  return (
    <PressableScale onPress={onPress} style={[styles.fillCenter, rStyle]}>
      <Icon />
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  fillCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
