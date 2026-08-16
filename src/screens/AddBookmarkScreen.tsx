import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/auth/AuthContext";
import { Chip } from "@/src/components/Chip";
import { createBookmark } from "@/src/db/bookmarks";
import { listCollections } from "@/src/db/collections";
import type { BookmarksStackParamList } from "@/src/navigation/RootNavigator";

type Props = NativeStackScreenProps<BookmarksStackParamList, "AddBookmark">;

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function AddBookmarkScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const collections = user ? listCollections(user.sub) : [];

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [collectionId, setCollectionId] = useState<string | null>(route.params?.collectionId ?? null);

  function save() {
    if (!user) return;
    if (!url.trim() || !title.trim()) {
      Alert.alert("URL and title are required");
      return;
    }
    createBookmark(user.sub, {
      url: normalizeUrl(url),
      title: title.trim(),
      notes: notes.trim() || undefined,
      collectionId: collectionId ?? undefined,
    });
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.label}>URL</Text>
          <TextInput
            value={url}
            onChangeText={setUrl}
            placeholder="https://example.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            style={styles.input}
          />

          <Text style={styles.label}>Title</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="Article title" style={styles.input} />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes"
            multiline
            style={[styles.input, styles.notesInput]}
          />

          <Text style={styles.label}>Collection</Text>
          <View style={styles.chipRow}>
            <Chip label="Uncategorised" selected={collectionId === null} onPress={() => setCollectionId(null)} />
            {collections.map((collection) => (
              <Chip
                key={collection.id}
                label={collection.name}
                selected={collectionId === collection.id}
                onPress={() => setCollectionId(collection.id)}
              />
            ))}
          </View>

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
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#171717",
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  chipRow: {
    marginBottom: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
