import { Tabs } from "expo-router";
import React, { useCallback } from "react";
import { TabBar } from "@/components/ui/bottom-tab-bar";
export const BaseTabs = [
  {
    name: "index",
  },
  {
    name: "music",
  },
  {
    name: "explore",
  },
  {
    name: "library",
  },
] as const;

export default function TabLayout() {
  const tabBar = useCallback((props: any) => <TabBar {...props} />, []);

  return (
    <Tabs
      tabBar={tabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      {BaseTabs.map((screen) => (
        <Tabs.Screen key={screen.name} name={screen.name} />
      ))}
    </Tabs>
  );
}
