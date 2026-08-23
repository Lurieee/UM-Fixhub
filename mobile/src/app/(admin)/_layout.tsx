import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';

import { OutlineIcon, OutlineIconName } from '@/components/outline-icon';

function TabIcon({ name, focused }: { name: OutlineIconName; focused: boolean }) {
  return <OutlineIcon name={name} size={20} color={focused ? '#A1000B' : '#9B8B8E'} />;
}

export default function AdminTabsLayout() {
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        maxWidth: Platform.OS === 'web' ? 430 : undefined,
        alignSelf: 'center',
        backgroundColor: '#F4F1EC',
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#A1000B',
          tabBarInactiveTintColor: '#9B8B8E',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
          tabBarStyle: { borderTopColor: '#EDE4DC' },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{ title: 'Dashboard', tabBarIcon: ({ focused }) => <TabIcon name="view-dashboard-outline" focused={focused} /> }}
        />
        <Tabs.Screen
          name="reports"
          options={{ title: 'Reports', tabBarIcon: ({ focused }) => <TabIcon name="file-document-outline" focused={focused} /> }}
        />
        <Tabs.Screen
          name="team"
          options={{ title: 'Team', tabBarIcon: ({ focused }) => <TabIcon name="account-group-outline" focused={focused} /> }}
        />
        <Tabs.Screen
          name="analytics"
          options={{ title: 'Analytics', tabBarIcon: ({ focused }) => <TabIcon name="chart-bar" focused={focused} /> }}
        />
        <Tabs.Screen
          name="settings"
          options={{ title: 'Settings', tabBarIcon: ({ focused }) => <TabIcon name="cog-outline" focused={focused} /> }}
        />
      </Tabs>
    </View>
  );
}
