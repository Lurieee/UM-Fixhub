import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryIconName } from '@/data/categories';
import { CURRENT_USER } from '@/data/current-user';
import { useReports } from '@/context/reports-context';
import { OutlineIcon } from '@/components/outline-icon';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Submitted: { bg: 'bg-blue-50', text: 'text-blue-700' },
  'In Progress': { bg: 'bg-orange-50', text: 'text-orange-700' },
  Resolved: { bg: 'bg-green-50', text: 'text-green-700' },
};

export default function HomeScreen() {
  const router = useRouter();
  const { reports } = useReports();
  const recent = reports.slice(0, 2);

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-3 mb-5">
          <Text className="text-ink text-2xl font-bold">Hi, {CURRENT_USER.firstName}!</Text>
          <View className="w-10 h-10 rounded-full bg-mustard/30 items-center justify-center">
            <Text className="text-ink text-xs font-bold">{CURRENT_USER.initials}</Text>
          </View>
        </View>

        {/* Hero CTA */}
        <View className="bg-maroon rounded-2xl p-5 mb-4">
          <Text className="text-white text-lg font-bold mb-1">Spot a campus issue?</Text>
          <Text className="text-white/80 text-xs leading-4 mb-4">
            Help us keep campus safe and fully functional. Let our maintenance team know what needs fixing.
          </Text>
          <Pressable
            onPress={() => router.push('/report')}
            className="bg-white self-start px-4 py-2.5 rounded-lg"
          >
            <Text className="text-maroon font-semibold text-xs">＋ Report New Issue</Text>
          </Pressable>
        </View>

        {/* Announcement */}
        <View className="flex-row gap-3 items-start bg-mustard/15 border border-mustard/40 rounded-xl px-4 py-3 mb-6">
          <Text className="text-base">📢</Text>
          <View className="flex-1">
            <Text className="text-ink text-xs font-semibold">DPT Building Elevator Maintenance</Text>
            <Text className="text-ink/60 text-[11px] mt-0.5">
              Out of service on Oct 24th from 8:00 AM to noon.
            </Text>
          </View>
        </View>

        {/* Recent reports */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-ink text-base font-semibold">Your Recent Reports</Text>
          <Pressable onPress={() => router.push('/my-reports')}>
            <Text className="text-maroon text-xs font-semibold">View All</Text>
          </Pressable>
        </View>

        <View className="gap-3">
          {recent.map((r) => {
            const style = STATUS_STYLES[r.status];
            return (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/my-reports/${r.id}`)}
                className="bg-white rounded-xl border border-ink/10 flex-row overflow-hidden"
              >
                <View className="w-14 bg-mustard/15 items-center justify-center overflow-hidden">
                  {r.photoUri ? (
                    <Image source={{ uri: r.photoUri }} style={{ width: 56, height: 56 }} />
                  ) : (
                    <OutlineIcon name={categoryIconName(r.category)} size={22} color="#A1000B" />
                  )}
                </View>
                <View className="flex-1 px-3 py-3 border-l border-dashed border-ink/10">
                  <Text className="text-ink text-sm font-semibold">{r.title}</Text>
                  <Text className="text-ink/50 text-xs mt-0.5">
                    {r.building} {r.room}
                  </Text>
                </View>
                <View className="px-3 items-center justify-center">
                  <Text className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                    {r.status}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
