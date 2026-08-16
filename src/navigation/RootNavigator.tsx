import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/src/auth/AuthContext";
import { AddBookmarkScreen } from "@/src/screens/AddBookmarkScreen";
import { AddCollectionScreen } from "@/src/screens/AddCollectionScreen";
import { BookmarkListScreen } from "@/src/screens/BookmarkListScreen";
import { CollectionListScreen } from "@/src/screens/CollectionListScreen";
import { LoginScreen } from "@/src/screens/LoginScreen";
import { ProfileScreen } from "@/src/screens/ProfileScreen";

export type AuthStackParamList = {
  Login: undefined;
};

export type BookmarksStackParamList = {
  BookmarkList: undefined;
  AddBookmark: { collectionId?: string | null } | undefined;
};

export type CollectionsStackParamList = {
  CollectionList: undefined;
  AddCollection: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type MainTabParamList = {
  BookmarksTab: undefined;
  CollectionsTab: undefined;
  ProfileTab: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const BookmarksStack = createNativeStackNavigator<BookmarksStackParamList>();
const CollectionsStack = createNativeStackNavigator<CollectionsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function BookmarksStackNavigator() {
  return (
    <BookmarksStack.Navigator>
      <BookmarksStack.Screen
        name="BookmarkList"
        component={BookmarkListScreen}
        options={{ title: "Bookmarks" }}
      />
      <BookmarksStack.Screen
        name="AddBookmark"
        component={AddBookmarkScreen}
        options={{ title: "New Bookmark" }}
      />
    </BookmarksStack.Navigator>
  );
}

function CollectionsStackNavigator() {
  return (
    <CollectionsStack.Navigator>
      <CollectionsStack.Screen
        name="CollectionList"
        component={CollectionListScreen}
        options={{ title: "Collections" }}
      />
      <CollectionsStack.Screen
        name="AddCollection"
        component={AddCollectionScreen}
        options={{ title: "New Collection" }}
      />
    </CollectionsStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="BookmarksTab" component={BookmarksStackNavigator} options={{ title: "Bookmarks" }} />
      <Tab.Screen
        name="CollectionsTab"
        component={CollectionsStackNavigator}
        options={{ title: "Collections" }}
      />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </AuthStack.Navigator>
    );
  }

  return <MainTabs />;
}
