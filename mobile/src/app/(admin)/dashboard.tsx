import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';
import { useReports } from '@/context/reports-context';

const PALETTE = ['#A1000B', '#E3A72F', '#3B82F6', '#22C55E', '#9B8B8E', '#8B5CF6'];

function initialsFor(name?: string) {
  if (!name) return 'A';
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { reports } = useReports();

  const total = reports.length;
  const pending = reports.filter((r) => r.status === 'Submitted').length;
  const inProgress = reports.filter((r) => r.status === 'In Progress').length;
  const resolved = reports.filter((r) => r.status === 'Resolved').length;
  const resolvedRate = total ? Math.round((resolved / total) * 100) : 0;

  const urgentAlerts = reports.filter((r) => r.urgency === 'High' && r.status !== 'Resolved').slice(0, 2);

  const categoryCounts: Record<string, number> = {};
  reports.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });
  const categoryEntries = Object.entries(categoryCounts);
  const maxCount = Math.max(1, ...categoryEntries.map(([, count]) => count));

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EC]">
      <View className="bg-[#151824] px-6 pt-4 pb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">Admin Panel</Text>
          <Text className="text-white/50 text-xs mt-0.5">Facilities Overview</Text>
        </View>
        <Pressable
          onPress={() => router.push('/profile')}
          className="w-10 h-10 rounded-full bg-mustard/60 items-center justify-center overflow-hidden"
        >
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={{ width: 40, height: 40 }} />
          ) : (
            <Text className="text-ink text-xs font-bold">{initialsFor(user?.name)}</Text>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="px-6 py-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-3 mb-4">
          <View style={{ width: '47%' }} className="bg-white rounded-xl p-4 border border-ink/10">
            <Text className="text-ink/50 text-xs mb-1">Total Reports</Text>
            <Text className="text-ink text-2xl font-bold">{total}</Text>
          </View>
          <View style={{ width: '47%' }} className="bg-white rounded-xl p-4 border border-ink/10">
            <Text className="text-ink/50 text-xs mb-1">Pending</Text>
            <Text className="text-ink text-2xl font-bold">{pending}</Text>
            <Text className="text-maroon text-[11px] mt-1 font-semibold">Urgent</Text>
          </View>
          <View style={{ width: '47%' }} className="bg-white rounded-xl p-4 border border-ink/10">
            <Text className="text-ink/50 text-xs mb-1">In Progress</Text>
            <Text className="text-ink text-2xl font-bold">{inProgress}</Text>
            <Text className="text-ink/40 text-[11px] mt-1">On Track</Text>
          </View>
          <View style={{ width: '47%' }} className="bg-white rounded-xl p-4 border border-ink/10">
            <Text className="text-ink/50 text-xs mb-1">Resolved</Text>
            <Text className="text-ink text-2xl font-bold">{resolved}</Text>
            <Text className="text-ink/40 text-[11px] mt-1">{resolvedRate}% rate</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/reports')}
          className="bg-maroon rounded-xl py-3 items-center mb-5"
        >
          <Text className="text-white text-xs font-semibold">View All Reports</Text>
        </Pressable>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-ink text-sm font-semibold">⚠ High Priority Alerts</Text>
          <Pressable onPress={() => router.push({ pathname: '/reports', params: { filter: 'urgent' } })}>
            <Text className="text-maroon text-xs font-semibold">View All</Text>
          </Pressable>
        </View>
        <View className="gap-2 mb-6">
          {urgentAlerts.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/reports/${r.id}`)}
              className="flex-row items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            >
              <View className="flex-1">
                <Text className="text-ink text-xs font-semibold">{r.title}</Text>
                <Text className="text-ink/50 text-[11px] mt-0.5">
                  {r.building} {r.room} · {r.reportedAt}
                </Text>
              </View>
              <Text className="text-red-600 text-[10px] font-bold px-2 py-1 bg-red-100 rounded-full">Urgent</Text>
            </Pressable>
          ))}
          {urgentAlerts.length === 0 && (
            <Text className="text-ink/40 text-xs">No urgent items right now.</Text>
          )}
        </View>

        <View className="bg-white border border-ink/10 rounded-xl p-4">
          <Text className="text-ink text-sm font-semibold mb-4">Reports by Category</Text>
          {categoryEntries.length === 0 ? (
            <Text className="text-ink/40 text-xs">No reports yet.</Text>
          ) : (
            <View className="flex-row items-end justify-between h-24">
              {categoryEntries.map(([category, count], index) => {
                const height = Math.max(8, (count / maxCount) * 80);
                return (
                  <View key={category} className="items-center gap-2">
                    <View style={{ height, width: 24, backgroundColor: PALETTE[index % PALETTE.length], borderRadius: 6 }} />
                    <Text className="text-ink/40 text-[10px]">{category}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}