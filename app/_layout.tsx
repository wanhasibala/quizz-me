// your-project/app/_layout.js
import { Tabs, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import Monthly from "./monthly";
import Daily from "./daily";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { toastConfig } from "./config/toast_config";

export default function Layout() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("monthly");

  // Function to navigate between tabs
  const handleTabPress = (tab: any) => {
    setSelectedTab(tab);
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "monthly" && styles.activeTab]}
            onPress={() => handleTabPress("monthly")}
          >
            <Text
              style={
                selectedTab === "monthly"
                  ? styles.activeTabText
                  : styles.tabText
              }
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "daily" && styles.activeTab]}
            onPress={() => handleTabPress("daily")}
          >
            <Text
              style={
                selectedTab === "daily" ? styles.activeTabText : styles.tabText
              }
            >
              Daily
            </Text>
          </TouchableOpacity>
        </View>
        {selectedTab === "monthly" ? <Monthly /> : <Daily />}
        {/* Render Tabs Screens */}
        {/* <Tabs> */}
        {/*   <Tabs.Screen name="monthly" options={{ headerShown: false }} /> */}
        {/*   <Tabs.Screen name="daily" options={{ headerShown: false }} /> */}
        {/* </Tabs> */}
        {/* Custom Header Tab */}
        <Toast config={toastConfig} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  tabContainer: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 99,
    borderColor: "#f9f9f9",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#5c7cfa",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
