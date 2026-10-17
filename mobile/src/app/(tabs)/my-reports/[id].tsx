import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryIconName } from '@/data/categories';
import { useReports } from '@/context/reports-context';
import { OutlineIcon } from '@/components/outline-icon';
import { useAppAlert } from '@/components/app-alert';

type StatusKey = 'submitted' | 'under_review' | 'awaiting_confirmation' | 'resolved';

const STATUS_STYLES: Record<StatusKey, { label: string; bg: string; text: string }> = {
  submitted: { label: 'Submitted', bg: 'bg-blue-50', text: 'text-blue-700' },
  under_review: { label: 'Under Review', bg: 'bg-orange-50', text: 'text-orange-700' },
  awaiting_confirmation: { label: 'Awaiting Confirmation', bg: 'bg-mustard/25', text: 'text-orange-700' },
  resolved: { label: 'Resolved', bg: 'bg-green-50', text: 'text-green-700' },
};

const FALLBACK_STYLE = { label: 'Unknown', bg: 'bg-ink/5', text: 'text-ink/60' };

// "Under Review" -> "under_review", "under_review" -> "under_review"
const toStatusKey = (status?: string): StatusKey | null => {
  const key = (status ?? '').trim().toLowerCase().replace(/\s+/g, '_');
  return key in STATUS_STYLES ? (key as StatusKey) : null;
};

function formatTimestamp(value: string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReport, updateReport } = useReports();
  const { showAlert } = useAppAlert();
  const [saving, setSaving] = useState(false);

  const report = getReport(id);
  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <Text className="text-ink/60">Report not found.</Text>
      </SafeAreaView>
    );
  }

  const statusKey = toStatusKey(report.status);
  const style = statusKey
    ? STATUS_STYLES[statusKey]
    : { ...FALLBACK_STYLE, label: report.status || FALLBACK_STYLE.label };

  const isUnderReviewOrLater =
    statusKey === 'under_review' || statusKey === 'awaiting_confirmation' || statusKey === 'resolved';
  const isAwaitingOrLater = statusKey === 'awaiting_confirmation' || statusKey === 'resolved';

  const steps = [
    { label: 'Submitted', done: true, sub: report.reportedAt },
    { label: 'Under Review', done: isUnderReviewOrLater, sub: formatTimestamp(report.underReviewAt) },
    { label: 'Awaiting Confirmation', done: isAwaitingOrLater, sub: formatTimestamp(report.awaitingConfirmationAt) },
    { label: 'Resolved', done: statusKey === 'resolved', sub: formatTimestamp(report.resolvedAt) },
  ];

  // Send the status in the same format the report data already uses
  // ("under_review" vs "Under Review"), so the update matches what the backend/context expects.
  const usesKeys = report.status === report.status?.toLowerCase();
  const toApiStatus = (key: StatusKey) => (usesKeys ? key : STATUS_STYLES[key].label);

  const changeStatus = async (key: 'resolved' | 'under_review') => {
    setSaving(true);
    try {
      await updateReport(report.id, { status: toApiStatus(key) as any });
    } catch (err: any) {
      showAlert('Failed', err.response?.data?.message || 'Could not update report.');
    } finally {
      setSaving(false);
    }
  };

  const handleResolve = () => {
    showAlert('Confirm & Close?', 'Has this issue actually been fixed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Resolve', onPress: () => changeStatus('resolved') },
    ]);
  };

  const handleReopen = () => {
    showAlert('Not Fixed Yet?', 'This will send the report back to the facilities team for more work.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reopen Report', onPress: () => changeStatus('under_review') },
    ]);
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
              {style.label}
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

        {statusKey === 'awaiting_confirmation' && (
          <View className="bg-mustard/15 border border-mustard/40 rounded-xl p-4 mb-5">
            <Text className="text-ink text-sm font-bold">Facilities marked this as fixed</Text>
            <Text className="text-ink/60 text-xs mt-1 leading-4">
              Is the issue actually resolved? Confirm to close it, or send it back if it&apos;s not fixed yet.
            </Text>
            <View className="flex-row gap-2 mt-3">
              <Pressable
                onPress={handleResolve}
                disabled={saving}
                className="flex-1 bg-maroon rounded-xl py-3 items-center"
              >
                <Text className="text-white text-xs font-semibold">{saving ? '...' : 'Confirm & Resolve'}</Text>
              </Pressable>
              <Pressable
                onPress={handleReopen}
                disabled={saving}
                className="flex-1 border border-mustard bg-white rounded-xl py-3 items-center"
              >
                <Text className="text-orange-700 text-xs font-semibold">Not Fixed — Reopen</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Text className="text-ink text-sm font-semibold mb-3">Tracking Status</Text>
        <View className="bg-white border border-ink/10 rounded-xl p-4">
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
      </ScrollView>
    </SafeAreaView>
  );
}