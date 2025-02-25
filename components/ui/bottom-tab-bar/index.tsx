import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { TabItem } from "./tab-item";
import { TabBarHeight } from "./constants";
import { ExpandedSheet } from "../expanded-sheet";

const TabBar = ({ state, navigation }) => {
  return (
    <View style={styles.container}>
      <ExpandedSheet />
      <Animated.View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          return (
            <TabItem
              key={route.key}
              screen={route.name}
              focused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    height: TabBarHeight,
    backgroundColor: "#323030",
  },
  tabsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#404040",
  },
});

export { TabBar };
