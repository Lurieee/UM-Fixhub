import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CURRENT_ADMIN } from '@/data/current-user';
import { useAppAlert } from '@/components/app-alert';

export default function AdminSettingsScreen() {
  const router = useRouter();
  const { showAlert } = useAppAlert();
  const [newReportAlerts, setNewReportAlerts] = useState(true);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [autoAssign, setAutoAssign] = useState(true);

  const handleLogout = () => {
    showAlert('Log Out?', 'You will need to sign back in to access the Admin Panel.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => router.push('/') },
    ]);
  };

  const showInfo = (title: string, message: string) => showAlert(title, message);

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EC]">
      <View className="bg-[#151824] px-6 pt-4 pb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">Admin Settings</Text>
          <Text className="text-white/50 text-xs mt-0.5">System Rules &amp; Preferences</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-mustard/60 items-center justify-center">
          <Text className="text-ink text-xs font-bold">{CURRENT_ADMIN.initials}</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-6 py-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3 bg-white border border-ink/10 rounded-xl p-4 mb-5">
          <View className="w-11 h-11 rounded-full bg-mustard/60 items-center justify-center">
            <Text className="text-ink text-xs font-bold">{CURRENT_ADMIN.initials}</Text>
          </View>
          <View>
            <Text className="text-ink text-sm font-semibold">{CURRENT_ADMIN.name}</Text>
            <Text className="text-ink/50 text-xs">{CURRENT_ADMIN.email}</Text>
            <Text className="text-maroon text-[11px] font-semibold mt-0.5">{CURRENT_ADMIN.role}</Text>
          </View>
        </View>

        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-5">
          <Text className="text-ink text-sm font-semibold mb-3">Notification Rules</Text>
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-ink/70 text-xs">New Report Alerts</Text>
            <Switch
              value={newReportAlerts}
              onValueChange={setNewReportAlerts}
              trackColor={{ false: '#E5DED6', true: '#A1000B' }}
            />
          </View>
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-ink/70 text-xs">Urgent Escalations Only</Text>
            <Switch
              value={urgentOnly}
              onValueChange={setUrgentOnly}
              trackColor={{ false: '#E5DED6', true: '#A1000B' }}
            />
          </View>
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-ink/70 text-xs">Staff Auto-Assignment</Text>
            <Switch
              value={autoAssign}
              onValueChange={setAutoAssign}
              trackColor={{ false: '#E5DED6', true: '#A1000B' }}
            />
          </View>
        </View>

        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-6">
          <Text className="text-ink text-sm font-semibold mb-3">Campus Zones &amp; Staff</Text>
          <Pressable
            onPress={() =>
              showInfo(
                'Campus Zones',
                'CEA Building, Library, Student Union, Science Annex, Engineering Hall, DPT Building, Gymnasium, Admin Building (8 zones).'
              )
            }
            className="flex-row items-center justify-between py-2"
          >
            <Text className="text-ink/70 text-xs">Manage Campus Zones</Text>
            <Text className="text-ink/40 text-xs">8 zones ›</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              showInfo(
                'Dispatch Rules',
                'Currently set to Auto: available staff are assigned automatically based on category and workload when you tap Dispatch Team on the dashboard.'
              )
            }
            className="flex-row items-center justify-between py-2"
          >
            <Text className="text-ink/70 text-xs">Dispatch Rules</Text>
            <Text className="text-ink/40 text-xs">Auto ›</Text>
          </Pressable>
          <Pressable
            onPress={() => showInfo('App Version', 'UM Fixhub v2.4.1\nBuilt with Expo + React Native.')}
            className="flex-row items-center justify-between py-2"
          >
            <Text className="text-ink/70 text-xs">App Version</Text>
            <Text className="text-ink/40 text-xs">v2.4.1 ›</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogout}
          className="border border-red-300 bg-red-50 rounded-xl py-3.5 items-center"
        >
          <Text className="text-red-600 font-semibold text-sm">Log Out Admin Panel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
