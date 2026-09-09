import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';

import { OutlineIcon, OutlineIconName } from '@/components/outline-icon';

function TabIcon({ name, focused }: { name: OutlineIconName; focused: boolean }) {
  return <OutlineIcon name={name} size={22} color={focused ? '#A1000B' : '#9B8B8E'} />;
}

export default function TabsLayout() {
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        maxWidth: Platform.OS === 'web' ? 430 : undefined,
        alignSelf: 'center',
        backgroundColor: '#FAF7F2',
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#A1000B',
          tabBarInactiveTintColor: '#9B8B8E',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarStyle: { borderTopColor: '#EDE4DC' },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <TabIcon name="home-outline" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: 'Report',
            tabBarIcon: ({ focused }) => <TabIcon name="plus-circle-outline" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="my-reports"
          options={{
            title: 'My Reports',
            tabBarIcon: ({ focused }) => <TabIcon name="file-document-outline" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="updates"
          options={{
            title: 'Updates',
            tabBarIcon: ({ focused }) => <TabIcon name="bell-outline" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}