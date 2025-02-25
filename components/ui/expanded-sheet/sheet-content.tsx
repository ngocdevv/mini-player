import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BaseOffset, ImageHeight } from "./constants";
import { ExpandedFooter } from "./expanded-footer";
import { InteractionList } from "./interaction-list";
import { BalanceSlider } from "../balance-slider";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { IconSymbol } from "../IconSymbol";

const width = Dimensions.get("screen").width;

type SheetContentProps = {
  progress: SharedValue<number>;
};

export const SheetContent = ({ progress }: SheetContentProps) => {
  const safeTop = useSafeAreaInsets().top;
  const offsetTop = safeTop + 60;
  const rImageStyle = useAnimatedStyle(() => {
    const imageSize = interpolate(
      progress.value,
      [0, 1, 2],
      [ImageHeight, width - 48, ImageHeight]
    );

    return {
      position: "absolute",
      height: imageSize,
      width: imageSize,
      borderRadius: interpolate(progress.value, [0, 1, 2], [8, 24, 8]),
      overflow: "hidden",
      left: interpolate(progress.value, [0, 1, 2], [10, 24, 12]),
      top: interpolate(
        progress.value,
        [0, 1, 2],
        [10, BaseOffset + offsetTop, safeTop + BaseOffset]
      ),
    };
  }, []);

  const rFillStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1, 2], [0, 1, 0]),
      marginTop: interpolate(
        progress.value,
        [0, 1, 2],
        [BaseOffset, width + safeTop - BaseOffset, safeTop]
      ),
    };
  });

  const rContentStyle = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(
        progress.value,
        [0, 1, 2],
        [BaseOffset, 0, safeTop + BaseOffset]
      ),
      opacity: interpolate(progress.value, [0, 1, 2], [1, 0, 1]),
    };
  });

  return (
    <Animated.View style={styles.fill}>
      {/* Mini Player */}
      <Animated.View style={[rContentStyle, styles.contentStyle]}>
        <View style={styles.imageStyle}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/-r9Fd-ghdnfZRs3M3pAF8s1-jlBWo5B5MEmducppbO9olCgpGVU3T_1CZTd6qiqBJmMGViEZCIWUsxk=w544-h544-l90-rj",
            }}
            style={styles.fill}
          />
        </View>
        <View style={styles.fill}>
          <Text style={{ color: "#ffffff" }} numberOfLines={1}>
            Em của ngày hôm qua
          </Text>
          <Text style={styles.subtitle}>Sơn Tùng M-TP</Text>
        </View>
        <View>
          <MaterialIcons name="play-arrow" color={"#ffffff"} size={24} />
        </View>
      </Animated.View>

      {/* Image Player */}
      <Animated.View style={rImageStyle}>
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/-r9Fd-ghdnfZRs3M3pAF8s1-jlBWo5B5MEmducppbO9olCgpGVU3T_1CZTd6qiqBJmMGViEZCIWUsxk=w544-h544-l90-rj",
          }}
          style={[StyleSheet.absoluteFill]}
        />
      </Animated.View>

      {/* Content Player */}
      <Animated.View style={rFillStyle}>
        <View style={styles.spaceContent}>
          <Text numberOfLines={1} style={[styles.title, { color: "#ffffff" }]}>
            Em của ngày hôm qua
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            Sơn Tùng M-TP
          </Text>
        </View>
        <InteractionList />
        <View style={styles.spaceContent}>
          <BalanceSlider
            width={width - 48}
            onChange={({ value }) => {
              console.log("value", value);
            }}
            totalDuration={100}
            initialPercentage={0.5}
          />
        </View>
        <View style={styles.control}>
          <MaterialIcons name="shuffle" color={"#ffffff"} size={24} />
          <MaterialIcons name="skip-previous" color={"#ffffff"} size={24} />
          <Pressable style={styles.playButton} onPress={() => {}}>
            <MaterialIcons name="play-arrow" color={"#000000"} size={30} />
          </Pressable>
          <MaterialIcons name="skip-next" color={"#ffffff"} size={24} />
          <MaterialIcons name="repeat" color={"#ffffff"} size={24} />
        </View>
      </Animated.View>
      <ExpandedFooter progressShared={progress} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  subtitle: {
    opacity: 0.5,
    marginTop: 2,
    color: "#ffffff",
  },
  imageStyle: {
    height: 44,
    width: 44,
    borderRadius: 8,
    overflow: "hidden",
  },
  contentStyle: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    paddingHorizontal: 12,
  },
  spaceContent: {
    marginHorizontal: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  control: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginHorizontal: 24,
  },
  playButton: {
    backgroundColor: "#ffffff",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
});
