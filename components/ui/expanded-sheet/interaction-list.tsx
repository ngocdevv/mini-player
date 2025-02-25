import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconSymbol } from "../IconSymbol";
const InteractionItem = memo(({ type }: { type: string }) => {
  return (
    <View style={styles.itemContainer}>
      {type === "like" && (
        <>
          <IconSymbol name="heart.fill" color={"#ffffff"} />
          <Text style={styles.itemText}>1,4 N</Text>
          <View style={styles.divider} />
          <IconSymbol name="heart.slash" color={"#ffffff"} />
        </>
      )}
      {type === "comment" && (
        <>
          <IconSymbol name="message" color={"#ffffff"} />
          <Text style={styles.itemText}>29</Text>
        </>
      )}
      {type === "share" && (
        <>
          <IconSymbol name="square.and.arrow.up" color={"#ffffff"} />
          <Text style={styles.itemText}>Chia sẻ</Text>
        </>
      )}
      {type === "download" && (
        <>
          <IconSymbol name="arrow.down.circle" color={"#ffffff"} />
          <Text style={styles.itemText}>Tải xuống</Text>
        </>
      )}
    </View>
  );
});

export const InteractionList = memo(() => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {["like", "comment", "share", "download"].map((item) => (
        <InteractionItem key={item} type={item} />
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 12,
    paddingVertical: 24,
    columnGap: 12,
  },
  itemContainer: {
    flexDirection: "row",
    borderRadius: 100,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    columnGap: 6,
    backgroundColor: "#000",
  },
  itemText: {
    color: "#ffffff",
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: "#ffffff",
    opacity: 0.2,
  },
});
