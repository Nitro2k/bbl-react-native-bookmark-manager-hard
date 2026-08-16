import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/auth/AuthContext";

export function LoginScreen() {
  const { login } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <Text>BBL Bookmark Manager</Text>
        <Pressable onPress={login}>
          <Text>Log in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
