import { Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAnnouncements } from '@/context/announcements-context';

export default function UpdatesScreen() {
  const { announcements, isLoading } = useAnnouncements();

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-ink text-2xl font-bold mt-3 mb-5">Campus Updates</Text>

        {isLoading && <Text className="text-ink/50 text-sm">Loading...</Text>}

        <View className="gap-3">
          {announcements.map((a) => (
            <View key={a.id} className="flex-row gap-3 bg-white rounded-xl p-4 border border-ink/10">
              <View className="w-9 h-9 rounded-full bg-mustard/20 items-center justify-center">
                <Text className="text-base">📢</Text>
              </View>
              <View className="flex-1">
                <Text className="text-ink text-sm font-semibold">{a.title}</Text>
                <Text className="text-ink/60 text-xs mt-0.5 leading-4">{a.body}</Text>
                <Text className="text-ink/35 text-[11px] mt-1">{a.date}</Text>
              </View>
            </View>
          ))}
          {!isLoading && announcements.length === 0 && (
            <Text className="text-ink/50 text-sm text-center mt-10">No announcements yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}