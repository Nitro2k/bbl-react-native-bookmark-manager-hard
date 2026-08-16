import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/auth/AuthContext";

export function LoginScreen() {
  const { login } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>BBL Bookmarks</Text>
        <Text style={styles.subtitle}>Your private, offline read-later list</Text>
        <Pressable onPress={login} style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#171717",
  },
  subtitle: {
    marginBottom: 32,
    fontSize: 16,
    color: "#737373",
  },
  button: {
    width: "100%",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#171717",
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
