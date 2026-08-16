import { SafeAreaView, Text, View } from "react-native";

export function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>BBL Bookmark Manager</Text>
      </View>
    </SafeAreaView>
  );
}
