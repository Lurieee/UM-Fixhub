import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryIconName } from '@/data/categories';
import { useReports } from '@/context/reports-context';
import { OutlineIcon } from '@/components/outline-icon';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Submitted: { bg: 'bg-blue-50', text: 'text-blue-700' },
  'In Progress': { bg: 'bg-orange-50', text: 'text-orange-700' },
  Resolved: { bg: 'bg-green-50', text: 'text-green-700' },
};

export default function MyReportsScreen() {
  const router = useRouter();
  const { reports } = useReports();

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-ink text-2xl font-bold mt-3 mb-5">My Reports</Text>

        <View className="gap-3">
          {reports.map((r) => {
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
                  <Text className="text-ink/40 text-[11px] mt-0.5">{r.reportedAt}</Text>
                </View>
                <View className="px-3 items-center justify-center">
                  <Text className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                    {r.status}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          {reports.length === 0 && (
            <Text className="text-ink/50 text-sm text-center mt-10">
              You haven&apos;t submitted any reports yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
