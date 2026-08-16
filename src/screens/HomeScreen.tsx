import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/src/auth/AuthContext";
import { type Bookmark, createBookmark, listBookmarks } from "@/src/db/bookmarks";

export function HomeScreen() {
  const { user, logout } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const refresh = useCallback(() => {
    if (!user) return;
    setBookmarks(listBookmarks(user.sub));
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function addTestBookmark() {
    if (!user) return;
    createBookmark(user.sub, {
      url: "https://example.com",
      title: `Test bookmark ${new Date().toLocaleTimeString()}`,
    });
    refresh();
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Text>BBL Bookmark Manager</Text>
        {user?.email ? <Text>{user.email}</Text> : null}
        <Pressable onPress={addTestBookmark}>
          <Text>Add test bookmark</Text>
        </Pressable>
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text>{item.title}</Text>}
        />
        <Pressable onPress={logout}>
          <Text>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
