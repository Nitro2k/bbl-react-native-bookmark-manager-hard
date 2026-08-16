import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/auth/AuthContext";
import { Chip } from "@/src/components/Chip";
import { type Bookmark, deleteBookmark, listBookmarks } from "@/src/db/bookmarks";
import { type Collection, listCollections } from "@/src/db/collections";
import type { BookmarksStackParamList } from "@/src/navigation/RootNavigator";

type Props = NativeStackScreenProps<BookmarksStackParamList, "BookmarkList">;

const ALL_FILTER = "all";
const UNCATEGORISED_FILTER = "uncategorised";

export function BookmarkListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(() => {
    if (!user) return;
    setCollections(listCollections(user.sub));

    if (activeFilter === ALL_FILTER) {
      setBookmarks(listBookmarks(user.sub));
    } else if (activeFilter === UNCATEGORISED_FILTER) {
      setBookmarks(listBookmarks(user.sub, null));
    } else {
      setBookmarks(listBookmarks(user.sub, activeFilter));
    }
  }, [user, activeFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", refresh);
    return unsubscribe;
  }, [navigation, refresh]);

  async function copyLink(bookmark: Bookmark) {
    await Clipboard.setUrlAsync(bookmark.url);
    if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
    setCopiedId(bookmark.id);
    copiedTimeout.current = setTimeout(() => setCopiedId(null), 1500);
  }

  function confirmDelete(bookmark: Bookmark) {
    if (!user) return;
    Alert.alert("Delete bookmark?", bookmark.title, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteBookmark(user.sub, bookmark.id);
          refresh();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.content}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          data={[{ id: ALL_FILTER, name: "All" }, { id: UNCATEGORISED_FILTER, name: "Uncategorised" }, ...collections]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Chip label={item.name} selected={activeFilter === item.id} onPress={() => setActiveFilter(item.id)} />
          )}
        />

        <Pressable
          onPress={() =>
            navigation.navigate("AddBookmark", {
              collectionId: activeFilter === ALL_FILTER ? undefined : activeFilter === UNCATEGORISED_FILTER ? null : activeFilter,
            })
          }
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ New Bookmark</Text>
        </Pressable>

        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowUrl}>{item.url}</Text>
                <Text style={styles.rowCollection}>
                  {collections.find((collection) => collection.id === item.collectionId)?.name ?? "Uncategorised"}
                </Text>
              </View>
              <View style={styles.rowActions}>
                <Pressable onPress={() => copyLink(item)} hitSlop={8}>
                  <Text style={styles.copyText}>{copiedId === item.id ? "Copied" : "Copy"}</Text>
                </Pressable>
                <Pressable onPress={() => confirmDelete(item)} hitSlop={8}>
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No bookmarks yet</Text>}
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
  filterRow: {
    marginBottom: 12,
    flexGrow: 0,
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
    paddingVertical: 12,
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    fontWeight: "500",
    color: "#171717",
  },
  rowUrl: {
    fontSize: 12,
    color: "#737373",
  },
  rowCollection: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "500",
    color: "#a3a3a3",
  },
  rowActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  copyText: {
    fontSize: 13,
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
