import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/auth/AuthContext";
import { type Collection, deleteCollection, listCollections } from "@/src/db/collections";
import type { CollectionsStackParamList } from "@/src/navigation/RootNavigator";

type Props = NativeStackScreenProps<CollectionsStackParamList, "CollectionList">;

export function CollectionListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);

  const refresh = useCallback(() => {
    if (!user) return;
    setCollections(listCollections(user.sub));
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", refresh);
    return unsubscribe;
  }, [navigation, refresh]);

  function confirmDelete(collection: Collection) {
    if (!user) return;
    Alert.alert(
      "Delete collection?",
      `"${collection.name}" will be removed. Its bookmarks become uncategorised, not deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteCollection(user.sub, collection.id);
            refresh();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.content}>
        <Pressable onPress={() => navigation.navigate("AddCollection")} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ New Collection</Text>
        </Pressable>

        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Pressable onPress={() => confirmDelete(item)} hitSlop={8}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No collections yet</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  addButton: {
    marginBottom: 16,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#171717",
    paddingVertical: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  listContent: {
    gap: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowTitle: {
    fontWeight: "500",
    color: "#171717",
  },
  deleteText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#dc2626",
  },
  emptyText: {
    marginTop: 32,
    textAlign: "center",
    color: "#a3a3a3",
  },
});
