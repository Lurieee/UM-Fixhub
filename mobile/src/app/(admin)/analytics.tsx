import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import api from '@/lib/api';
import { useAuth } from '@/context/auth-context';

type Analytics = {
  total: number;
  resolved: number;
  in_progress: number;
  pending: number;
  resolution_rate: number;
  by_category: { category: string; count: number }[];
  trend: { date: string; count: number }[];
};

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

export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/analytics')
      .then(({ data }) => setAnalytics(data))
      .catch(() => setError('Could not load analytics.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const last7Days: { label: string; count: number }[] = [];
  if (analytics) {
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const iso = date.toISOString().slice(0, 10);
      const count = analytics.trend.find((t) => t.date === iso)?.count || 0;
      last7Days.push({ label: date.toLocaleDateString([], { weekday: 'short' }), count });
    }
  }
  const maxTrend = Math.max(1, ...last7Days.map((d) => d.count));
  const categoryTotal = analytics?.by_category.reduce((sum, c) => sum + c.count, 0) || 0;

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EC]">
      <View className="bg-[#151824] px-6 pt-4 pb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">Analytics &amp; Reports</Text>
          <Text className="text-white/50 text-xs mt-0.5">Performance &amp; Resolution KPIs</Text>
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
        {loading && <Text className="text-ink/50 text-sm">Loading...</Text>}
        {error && <Text className="text-red-600 text-sm">{error}</Text>}

        {analytics && (
          <>
            <View className="flex-row gap-3 mb-5">
              <View className="flex-1 bg-white border border-ink/10 rounded-xl p-4">
                <Text className="text-ink/50 text-xs mb-1">Total Reports</Text>
                <Text className="text-ink text-xl font-bold">{analytics.total}</Text>
              </View>
              <View className="flex-1 bg-white border border-ink/10 rounded-xl p-4">
                <Text className="text-ink/50 text-xs mb-1">Resolution Rate</Text>
                <Text className="text-ink text-xl font-bold">{analytics.resolution_rate}%</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mb-5">
              <View className="flex-1 bg-white border border-ink/10 rounded-xl p-4">
                <Text className="text-ink/50 text-xs mb-1">Pending</Text>
                <Text className="text-ink text-xl font-bold">{analytics.pending}</Text>
              </View>
              <View className="flex-1 bg-white border border-ink/10 rounded-xl p-4">
                <Text className="text-ink/50 text-xs mb-1">In Progress</Text>
                <Text className="text-ink text-xl font-bold">{analytics.in_progress}</Text>
              </View>
            </View>

            <View className="bg-white border border-ink/10 rounded-xl p-4 mb-5">
              <Text className="text-ink text-sm font-semibold mb-4">Reports Submitted (Last 7 Days)</Text>
              {last7Days.every((d) => d.count === 0) ? (
                <Text className="text-ink/40 text-xs">No reports in the last 7 days.</Text>
              ) : (
                <>
                  <View className="flex-row items-end justify-between h-20 mb-2">
                    {last7Days.map((d, i) => (
                      <View
                        key={i}
                        style={{ height: Math.max(4, (d.count / maxTrend) * 72), width: 18, backgroundColor: '#A1000B', borderRadius: 4 }}
                      />
                    ))}
                  </View>
                  <View className="flex-row justify-between">
                    {last7Days.map((d, i) => (
                      <Text key={i} className="text-ink/35 text-[9px]">{d.label}</Text>
                    ))}
                  </View>
                </>
              )}
            </View>

            <View className="bg-white border border-ink/10 rounded-xl p-4">
              <Text className="text-ink text-sm font-semibold mb-4">Category Distribution</Text>
              {analytics.by_category.length === 0 ? (
                <Text className="text-ink/40 text-xs">No reports yet.</Text>
              ) : (
                analytics.by_category.map((c, index) => {
                  const pct = categoryTotal ? Math.round((c.count / categoryTotal) * 100) : 0;
                  return (
                    <View key={c.category} className="mb-4 last:mb-0">
                      <View className="flex-row justify-between mb-1.5">
                        <Text className="text-ink text-xs font-medium">{c.category}</Text>
                        <Text className="text-ink/50 text-xs">{pct}%</Text>
                      </View>
                      <View className="h-2 bg-[#F4F1EC] rounded-full overflow-hidden">
                        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: PALETTE[index % PALETTE.length] }} />
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}