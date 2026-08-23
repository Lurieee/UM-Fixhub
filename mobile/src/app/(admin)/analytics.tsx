import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CURRENT_ADMIN } from '@/data/current-user';

const TREND = [8, 14, 10, 18, 16, 22];
const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
const maxTrend = Math.max(...TREND);

const COMPLETION = [
  { label: 'Plumbing', pct: 90, color: '#E3A72F' },
  { label: 'Electrical', pct: 98, color: '#A1000B' },
];

const PERIODS = ['This Month (Oct 2026)', 'Last Month (Sep 2026)', 'This Quarter (Q4 2026)', 'This Year (2026)'];

export default function AdminAnalyticsScreen() {
  const [period, setPeriod] = useState(PERIODS[0]);
  const [periodOpen, setPeriodOpen] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EC]">
      <View className="bg-[#151824] px-6 pt-4 pb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">Analytics &amp; Reports</Text>
          <Text className="text-white/50 text-xs mt-0.5">Performance &amp; Resolution KPIs</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-mustard/60 items-center justify-center">
          <Text className="text-ink text-xs font-bold">{CURRENT_ADMIN.initials}</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-6 py-5" showsVerticalScrollIndicator={false}>
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-ink text-sm font-semibold">{period}</Text>
            <Pressable
              onPress={() => setPeriodOpen((v) => !v)}
              className="flex-row items-center gap-1 bg-white border border-ink/10 px-3 py-1.5 rounded-full"
            >
              <Text className="text-ink/60 text-xs">📅 Change Period</Text>
            </Pressable>
          </View>
          {periodOpen && (
            <View className="bg-white border border-ink/10 rounded-lg mt-2 overflow-hidden">
              {PERIODS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => {
                    setPeriod(p);
                    setPeriodOpen(false);
                  }}
                  className={`px-4 py-3 ${p === period ? 'bg-mustard/15' : ''}`}
                >
                  <Text className="text-ink text-xs">{p}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View className="flex-row gap-3 mb-5">
          <View className="flex-1 bg-white border border-ink/10 rounded-xl p-4">
            <Text className="text-ink/50 text-xs mb-1">Avg Resolution Time</Text>
            <Text className="text-ink text-xl font-bold">4.2 Hrs</Text>
            <Text className="text-green-600 text-[11px] mt-1">↓ 18% improvement</Text>
          </View>
          <View className="flex-1 bg-white border border-ink/10 rounded-xl p-4">
            <Text className="text-ink/50 text-xs mb-1">Success Rate</Text>
            <Text className="text-ink text-xl font-bold">94.5%</Text>
            <Text className="text-green-600 text-[11px] mt-1">↑ 2% increase</Text>
          </View>
        </View>

        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-5">
          <Text className="text-ink text-sm font-semibold mb-4">Submitted Reports Trend</Text>
          <View className="flex-row items-end justify-between h-20 mb-2">
            {TREND.map((v, i) => (
              <View
                key={i}
                style={{ height: (v / maxTrend) * 72, width: 18, backgroundColor: '#A1000B', borderRadius: 4 }}
              />
            ))}
          </View>
          <View className="flex-row justify-between">
            {WEEK_LABELS.map((w) => (
              <Text key={w} className="text-ink/35 text-[9px]">
                {w}
              </Text>
            ))}
          </View>
        </View>

        <View className="bg-white border border-ink/10 rounded-xl p-4">
          <Text className="text-ink text-sm font-semibold mb-4">Team Completion Rates</Text>
          {COMPLETION.map((c) => (
            <View key={c.label} className="mb-4 last:mb-0">
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-ink text-xs font-medium">{c.label}</Text>
                <Text className="text-ink/50 text-xs">{c.pct}%</Text>
              </View>
              <View className="h-2 bg-[#F4F1EC] rounded-full overflow-hidden">
                <View style={{ width: `${c.pct}%`, height: '100%', backgroundColor: c.color }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
