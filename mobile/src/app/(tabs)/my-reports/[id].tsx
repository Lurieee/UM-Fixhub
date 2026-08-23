import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryIconName } from '@/data/categories';
import { useReports } from '@/context/reports-context';
import { OutlineIcon } from '@/components/outline-icon';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Submitted: { bg: 'bg-blue-50', text: 'text-blue-700' },
  'In Progress': { bg: 'bg-orange-50', text: 'text-orange-700' },
  Resolved: { bg: 'bg-green-50', text: 'text-green-700' },
};

export default function ReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReport, addMessage } = useReports();
  const [draft, setDraft] = useState('');

  const report = getReport(id);
  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <Text className="text-ink/60">Report not found.</Text>
      </SafeAreaView>
    );
  }

  const style = STATUS_STYLES[report.status];
  const steps = [
    { label: 'Submitted', done: true, sub: report.reportedAt },
    { label: 'Reviewed by Staff', done: report.status !== 'Submitted', sub: '' },
    {
      label: report.status === 'Resolved' ? 'Resolved' : 'In Progress',
      done: report.status !== 'Submitted',
      sub: report.status === 'In Progress' ? 'Assigned to Marcus (Staff)' : '',
    },
  ];

  const handleSend = () => {
    if (!draft.trim()) return;
    addMessage(report.id, draft.trim());
    setDraft('');
  };

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 mt-3 mb-5">
          <Pressable
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-mustard/20 items-center justify-center"
          >
            <Text className="text-ink text-lg">‹</Text>
          </Pressable>
          <Text className="text-ink text-lg font-bold">Report {report.refCode}</Text>
        </View>

        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-5">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-ink text-base font-semibold">{report.title}</Text>
            <Text className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
              {report.status}
            </Text>
          </View>
          <Text className="text-ink/50 text-xs mb-3">
            {report.building} {report.room} · Reported {report.reportedAt}
          </Text>

          {report.photoUri ? (
            <Image source={{ uri: report.photoUri }} style={{ width: '100%', height: 160, borderRadius: 8 }} className="mb-3" />
          ) : (
            <View className="bg-mustard/10 rounded-lg items-center justify-center py-6 mb-3">
              <OutlineIcon name={categoryIconName(report.category)} size={32} color="#A1000B" />
            </View>
          )}

          <Text className="text-ink/70 text-xs leading-5">{report.description}</Text>
        </View>

        <Text className="text-ink text-sm font-semibold mb-3">Tracking Status</Text>
        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-5">
          {steps.map((s, i) => (
            <View key={s.label} className={`flex-row gap-3 ${i < steps.length - 1 ? 'mb-4' : ''}`}>
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  s.done ? 'bg-maroon' : 'bg-ink/10'
                }`}
              >
                <Text className={`text-[11px] ${s.done ? 'text-white' : 'text-ink/40'}`}>
                  {s.done ? '✓' : ''}
                </Text>
              </View>
              <View>
                <Text className={`text-xs font-semibold ${s.done ? 'text-ink' : 'text-ink/40'}`}>
                  {s.label}
                </Text>
                {!!s.sub && <Text className="text-ink/40 text-[11px] mt-0.5">{s.sub}</Text>}
              </View>
            </View>
          ))}
        </View>

        <Text className="text-ink text-sm font-semibold mb-3">Staff Updates &amp; Chat</Text>
        <View className="gap-3 mb-4">
          {report.messages.length === 0 && (
            <Text className="text-ink/40 text-xs">No updates yet.</Text>
          )}
          {report.messages.map((m) => (
            <View key={m.id} className="flex-row gap-3">
              <View className="w-8 h-8 rounded-full bg-maroon items-center justify-center">
                <Text className="text-white text-xs font-bold">{m.from.charAt(0)}</Text>
              </View>
              <View className="flex-1 bg-white border border-ink/10 rounded-xl p-3">
                <Text className="text-ink text-xs font-semibold mb-1">{m.from}</Text>
                <Text className="text-ink/70 text-xs leading-4">{m.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="flex-row items-center gap-2">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a message..."
            placeholderTextColor="#8A7B7E"
            className="flex-1 bg-white border border-ink/10 rounded-xl px-4 py-3 text-ink text-sm"
          />
          <Pressable onPress={handleSend} className="bg-maroon rounded-xl px-4 py-3">
            <Text className="text-white text-xs font-semibold">Send</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
