import React, { useMemo } from "react";
import { Dimensions, Image, Pressable, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarHeight } from "../bottom-tab-bar/constants";
import { MiniPlayerHeight } from "./constants";
import { SheetContent } from "./sheet-content";
import { EasingsUtils } from "@/constants/easings";
import { ExpandedSheetMutableProgress } from "../bottom-tab-bar/shared-progress";
import { IconSymbol } from "../IconSymbol";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const windowHeight = Dimensions.get("screen").height;

export const ExpandedSheet = () => {
  const progress = ExpandedSheetMutableProgress;

  const isTapped = useSharedValue(false);
  const progressThreshold = 0.8;
  const progressThreshold2 = 1.5;
  const safeTop = useSafeAreaInsets().top;
  const panEnabled = useSharedValue(false);
  const startProgress = useSharedValue(0);
  const activeAreaHeight = useMemo(() => {
    return MiniPlayerHeight + TabBarHeight + safeTop;
  }, [safeTop]);

  const tapGesture = Gesture.Tap()
    .onBegin((event) => {
      if (progress.value === 2 && event.y > activeAreaHeight) return;
      if (progress.value >= progressThreshold && progress.value !== 2) return;
      isTapped.value = true;
    })
    .onTouchesUp(() => {
      if (
        progress.value >= progressThreshold ||
        progress.value > progressThreshold2
      ) {
        return;
      }
      progress.value = withTiming(1, {
        duration: 450,
        easing: EasingsUtils.inOut,
      });
    })
    .onFinalize(() => {
      isTapped.value = false;
    });

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      if (progress.value === 2 && event.y > activeAreaHeight) return;
      if (progress.value === 0) return;
      panEnabled.value = true;
      startProgress.value = progress.value;
    })
    .onUpdate((event) => {
      if (!panEnabled.value) return;
      const newProgress =
        startProgress.value - event.translationY / windowHeight;
      progress.value = Math.min(2, Math.max(0, newProgress));
    })
    .onFinalize((_) => {
      if (!panEnabled.value) return;
      panEnabled.value = false;
      if (
        progress.value < progressThreshold2 &&
        progress.value > progressThreshold
      ) {
        progress.value = withTiming(1, {
          duration: 350,
          easing: EasingsUtils.inOut,
        });
      } else if (progress.value < progressThreshold) {
        progress.value = withTiming(0, {
          duration: 350,
          easing: EasingsUtils.inOut,
        });
      } else if (progress.value > progressThreshold2 && progress.value < 2) {
        progress.value = withTiming(2, {
          duration: 350,
          easing: EasingsUtils.inOut,
        });
      }
    });

  const rSheetStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        progress.value,
        [0, 1, 2],
        [MiniPlayerHeight, windowHeight, windowHeight]
      ),
      bottom: interpolate(progress.value, [0, 1, 2], [TabBarHeight, 0, 0]),
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1, 2],
        ["#323030", "#000000", "#000000"]
      ),
    };
  });

  const rKnobStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1, 2], [0, 1, 0]),
    };
  });

  const gestures = Gesture.Simultaneous(tapGesture, panGesture);

  const onClose = () => {
    progress.value = withTiming(0, {
      duration: 350,
      easing: EasingsUtils.inOut,
    });
  };
  const top = safeTop + 12;

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[rSheetStyle, styles.container]}>
        <Animated.View
          style={[
            rKnobStyle,
            {
              top,
            },
            styles.knobContainer,
          ]}
        >
          <Pressable onPress={onClose}>
            <MaterialIcons size={24} name="arrow-drop-down" color={"#ffffff"} />
          </Pressable>
        </Animated.View>
        <SheetContent progress={progress} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  knobContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 1000,
  },
});
