import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineIcon } from '@/components/outline-icon';
import { CATEGORIES } from '@/data/categories';

export default function IssueCategoriesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 mt-3 mb-6">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.push('/home'))}
            className="w-9 h-9 rounded-full bg-mustard/20 items-center justify-center"
          >
            <Text className="text-ink text-lg">‹</Text>
          </Pressable>
          <Text className="text-ink text-xl font-bold">New Report</Text>
        </View>

        <Text className="text-ink text-lg font-bold mb-1">What needs attention?</Text>
        <Text className="text-ink/60 text-xs mb-5 leading-4">
          Select a category below to describe the maintenance issue.
        </Text>

        <View className="flex-row flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.key}
              onPress={() => router.push({ pathname: '/report/form', params: { category: c.key } })}
              style={{ width: '47%' }}
              className="bg-white border border-ink/10 rounded-xl p-4"
            >
              <View className="w-9 h-9 rounded-full bg-mustard/20 items-center justify-center mb-3">
                <OutlineIcon name={c.iconName} size={21} color="#A1000B" />
              </View>
              <Text className="text-ink text-sm font-semibold mb-0.5">{c.label}</Text>
              <Text className="text-ink/50 text-[11px] leading-4">{c.description}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
