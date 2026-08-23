import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineIcon } from '@/components/outline-icon';
import { CATEGORIES } from '@/data/categories';

export default function ExploreScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-cream items-center">
      <ScrollView style={{ width: '100%', maxWidth: 430 }} contentContainerClassName="px-6 pb-8">
        <Text className="text-ink text-2xl font-bold mt-3 mb-1">Campus Help</Text>
        <Text className="text-ink/60 text-sm leading-5 mb-6">
          Choose the kind of issue you want to report. Clear details help the facilities team respond faster.
        </Text>
        <View className="gap-3">
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.key}
              onPress={() => router.push({ pathname: '/report/form', params: { category: category.key } })}
              className="flex-row items-center gap-3 bg-white border border-ink/10 rounded-xl p-4"
            >
              <View className="w-11 h-11 rounded-full bg-mustard/20 items-center justify-center">
                <OutlineIcon name={category.iconName} size={23} color="#A1000B" />
              </View>
              <View className="flex-1">
                <Text className="text-ink text-sm font-semibold">{category.label}</Text>
                <Text className="text-ink/50 text-xs mt-0.5">{category.description}</Text>
              </View>
              <Text className="text-maroon text-lg">›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
