import { EasingsUtils } from "@/constants/easings";
import { PressableScale } from "pressto";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { IconSymbol } from "../IconSymbol";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
        return <MaterialIcons size={28} name="home" color={"#ffffff"} />;
      case "music":
        return <MaterialIcons size={28} name="music-note" color={"#ffffff"} />;
      case "library":
        return <MaterialIcons size={28} name="library-add" color={"#ffffff"} />;
      case "explore":
        return <MaterialIcons size={28} name="explore" color={"#ffffff"} />;
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
