import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryIconName } from '@/data/categories';
import { CURRENT_ADMIN } from '@/data/current-user';
import { useReports } from '@/context/reports-context';
import { OutlineIcon } from '@/components/outline-icon';

const FILTERS = ['All', 'Pending', 'Active', 'Resolved'] as const;

export default function AdminReportsScreen() {
  const router = useRouter();
  const { reports } = useReports();
  const { filter: filterParam } = useLocalSearchParams<{ filter?: string }>();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const filtered = useMemo(() => {
    let list = reports;
    if (filterParam === 'urgent') {
      list = list.filter((r) => r.urgency === 'High' && r.status !== 'Resolved');
    } else if (filter === 'Pending') {
      list = list.filter((r) => r.status === 'Submitted');
    } else if (filter === 'Active') {
      list = list.filter((r) => r.status === 'In Progress');
    } else if (filter === 'Resolved') {
      list = list.filter((r) => r.status === 'Resolved');
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.building.toLowerCase().includes(q) ||
          r.room.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reports, filter, filterParam, query]);

  const badge = (r: (typeof reports)[number]) => {
    if (r.urgency === 'High' && r.status !== 'Resolved') {
      return { label: 'Urgent', bg: 'bg-red-100', text: 'text-red-600' };
    }
    if (r.status === 'Submitted') return { label: 'Pending', bg: 'bg-mustard/25', text: 'text-orange-700' };
    if (r.status === 'In Progress') return { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-700' };
    return { label: 'Resolved', bg: 'bg-green-50', text: 'text-green-700' };
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EC]">
      <View className="bg-[#151824] px-6 pt-4 pb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">All Campus Reports</Text>
          <Text className="text-white/50 text-xs mt-0.5">Overview &amp; Dispatch Dispatch</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-mustard/60 items-center justify-center">
          <Text className="text-ink text-xs font-bold">{CURRENT_ADMIN.initials}</Text>
        </View>
      </View>

      <View className="px-6 pt-4">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by report, location..."
          placeholderTextColor="#8A7B7E"
          className="bg-white border border-ink/10 rounded-xl px-4 py-3 text-ink text-sm mb-3"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pb-3">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                className={`px-4 py-2 rounded-full border ${
                  active ? 'bg-maroon border-maroon' : 'bg-white border-ink/10'
                }`}
              >
                <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-ink/60'}`}>
                  {f} {f === 'All' ? `(${reports.length})` : ''}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerClassName="px-6 pb-6 gap-3" showsVerticalScrollIndicator={false}>
        {filtered.map((r) => {
          const b = badge(r);
          return (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/reports/${r.id}`)}
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
                <Text className="text-ink/35 text-[11px] mt-0.5">{r.reportedAt}</Text>
              </View>
              <View className="px-3 items-center justify-center">
                <Text className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${b.bg} ${b.text}`}>
                  {b.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
        {filtered.length === 0 && (
          <Text className="text-ink/40 text-xs text-center mt-8">No reports match this filter.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
