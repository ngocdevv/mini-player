import { StyleSheet, View, Text } from "react-native";
export default function MusicScreen() {
  return (
    <View style={styles.container}>
      <Text>Music</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
