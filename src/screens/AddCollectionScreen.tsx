import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/auth/AuthContext";
import { createCollection } from "@/src/db/collections";
import type { CollectionsStackParamList } from "@/src/navigation/RootNavigator";

type Props = NativeStackScreenProps<CollectionsStackParamList, "AddCollection">;

export function AddCollectionScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState("");

  function save() {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert("A name is required");
      return;
    }
    createCollection(user.sub, name.trim());
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Reading list" style={styles.input} />

          <Pressable onPress={save} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "500",
    color: "#525252",
  },
  input: {
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#171717",
  },
  saveButton: {
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#171717",
    paddingVertical: 14,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
