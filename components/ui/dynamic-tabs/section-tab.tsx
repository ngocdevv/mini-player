import React, { useCallback } from "react";
import type { LayoutRectangle } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { TabBarHeight } from "../bottom-tab-bar/constants";

type SectionTabsProps = {
  progress: SharedValue<number>;
  data: string[];
  indicatorLayout: SharedValue<LayoutRectangle>;
  layouts: SharedValue<LayoutRectangle[]>;
  onSelectSection?: (index: number) => void;
};

const SectionTabs: React.FC<SectionTabsProps> = React.memo(
  ({ data, indicatorLayout, layouts, onSelectSection, progress }) => {
    const rIndicatorLayoutStyle = useAnimatedStyle(() => {
      return {
        position: "absolute",
        bottom: 0,
        width: indicatorLayout.value.width,
        left: indicatorLayout.value.x,
        height: 2,
      };
    }, []);

    const rOpacity = useAnimatedStyle(() => {
      return {
        opacity: interpolate(progress.value, [0, 1, 2], [0, 0.6, 1]),
      };
    }, []);

    const rOpacityIndicator = useAnimatedStyle(() => {
      return {
        opacity: interpolate(progress.value, [0, 1, 2], [0, 0, 1]),
      };
    }, []);

    const renderTab = useCallback((title: string, index: number) => {
      return (
        <Pressable
          onLayout={({ nativeEvent: { layout } }) => {
            layouts.value[index] = { ...layout };
            layouts.value = [...layouts.value];
            if (index === 0) {
              indicatorLayout.value = { ...layout };
            }
          }}
          onPress={() => {
            progress.value = withTiming(2, {
              duration: 300,
            });
            return onSelectSection?.(index);
          }}
          style={[styles.container]}
          key={index}
        >
          <Text style={[styles.title]} numberOfLines={1}>
            {title}
          </Text>
        </Pressable>
      );
    }, []);

    return (
      <Animated.View style={[styles.safeContainer, rOpacity]}>
        <Animated.View
          style={[styles.indicator, rOpacityIndicator, rIndicatorLayoutStyle]}
        />
        {data.map(renderTab)}
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "white",
  },
  safeContainer: {
    zIndex: 5,
    flexDirection: "row",
    height: TabBarHeight,
  },
  indicator: {
    backgroundColor: "white",
    zIndex: 10,
  },
});

export { SectionTabs };
