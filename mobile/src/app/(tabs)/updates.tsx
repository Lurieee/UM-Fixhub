import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CURRENT_USER } from '@/data/current-user';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    icon: '✅',
    title: 'Status Updated to Resolved',
    description: 'Leaky Water Fountain in Student Union lobby has been fixed.',
    time: '1 hour ago',
    unread: true,
    reportId: '2',
  },
  {
    id: '2',
    icon: '💬',
    title: 'Staff Replied to Report',
    description: 'Marcus added a comment on your Broken Desk Chair report.',
    time: '2 hours ago',
    unread: true,
    reportId: '1',
  },
  {
    id: '3',
    icon: '⚠️',
    title: 'Water Outage Notice',
    description: 'Campus water shutoff completed in Engineering Quad.',
    time: 'Yesterday',
    unread: false,
    reportId: null,
  },
];

export default function UpdatesScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handlePress = (id: string, reportId: string | null) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    if (reportId) {
      router.push(`/my-reports/${reportId}`);
    }
  };

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mt-3 mb-5">
          <Text className="text-ink text-2xl font-bold">Notifications</Text>
          <View className="w-10 h-10 rounded-full bg-mustard/30 items-center justify-center">
            <Text className="text-ink text-xs font-bold">{CURRENT_USER.initials}</Text>
          </View>
        </View>

        <View className="gap-3">
          {notifications.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => handlePress(n.id, n.reportId)}
              className={`flex-row gap-3 bg-white rounded-xl p-4 border ${
                n.unread ? 'border-maroon/20' : 'border-ink/10'
              }`}
            >
              <View className="w-9 h-9 rounded-full bg-mustard/20 items-center justify-center">
                <Text className="text-base">{n.icon}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-ink text-sm font-semibold flex-1">{n.title}</Text>
                  {n.unread && <View className="w-2 h-2 rounded-full bg-maroon" />}
                </View>
                <Text className="text-ink/60 text-xs mt-0.5 leading-4">{n.description}</Text>
                <Text className="text-ink/35 text-[11px] mt-1">{n.time}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
