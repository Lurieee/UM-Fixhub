import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useReports } from '@/context/reports-context';

export default function ReportSubmittedScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReport } = useReports();
  const report = getReport(id);

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <View style={{ width: '100%', maxWidth: 430 }} className="flex-1 px-6 justify-center">
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-maroon items-center justify-center mb-6">
            <Text className="text-white text-3xl">✓</Text>
          </View>
          <Text className="text-ink text-2xl font-bold mb-1">Report Submitted!</Text>
          <Text className="text-ink/60 text-sm text-center">
            Thank you for keeping our campus safe and clean.
          </Text>
        </View>

        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-ink/50 text-xs">Reference Code</Text>
            <Text className="text-ink text-xs font-semibold">{report?.refCode}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-ink/50 text-xs">Estimated Review Time</Text>
            <Text className="text-maroon text-xs font-semibold">Within 2 hours</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/home')}
          className="bg-maroon rounded-xl py-3.5 items-center mb-3"
        >
          <Text className="text-white font-semibold">Back to Home</Text>
        </Pressable>
        <Pressable
          onPress={() => report && router.push(`/my-reports/${report.id}`)}
          className="bg-white border border-ink/10 rounded-xl py-3.5 items-center"
        >
          <Text className="text-ink font-semibold">Track Status</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
