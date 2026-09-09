import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryIconName } from '@/data/categories';
import { useReports, ReportStatus } from '@/context/reports-context';
import { CURRENT_ADMIN } from '@/data/current-user';
import { OutlineIcon } from '@/components/outline-icon';
import { useAppAlert } from '@/components/app-alert';

function formatTimestamp(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const NEXT_STATUS: Record<ReportStatus, ReportStatus | null> = {
  Submitted: 'In Progress',
  'In Progress': 'Resolved',
  Resolved: null,
};

export default function AdminReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReport, updateReport } = useReports();
  const { showAlert } = useAppAlert();
  const report = getReport(id);

  const [assignedStaff, setAssignedStaff] = useState(report?.assignedStaff ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAssignedStaff(report?.assignedStaff ?? '');
  }, [report?.assignedStaff]);

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-[#F4F1EC] items-center justify-center">
        <Text className="text-ink/60">Report not found.</Text>
      </SafeAreaView>
    );
  }

  const assignmentChanged = assignedStaff !== (report.assignedStaff ?? '');
  const nextStatus = NEXT_STATUS[report.status];

  const saveAssignment = async () => {
    setSaving(true);
    try {
      await updateReport(report.id, { assignedStaff: assignedStaff || null });
    } catch (err: any) {
      showAlert('Update failed', err.response?.data?.message || 'Could not save assignment.');
    } finally {
      setSaving(false);
    }
  };

  const advanceStatus = async () => {
    if (!nextStatus) return;
    setSaving(true);
    try {
      await updateReport(report.id, { status: nextStatus });
    } catch (err: any) {
      showAlert('Update failed', err.response?.data?.message || 'Could not update status.');
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { label: 'Submitted', done: true, sub: report.reportedAt },
    {
      label: 'In Progress',
      done: report.status === 'In Progress' || report.status === 'Resolved',
      sub: formatTimestamp(report.inProgressAt),
    },
    { label: 'Resolved', done: report.status === 'Resolved', sub: formatTimestamp(report.resolvedAt) },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EC]">
      <View className="bg-[#151824] px-6 pt-4 pb-5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <Pressable onPress={() => router.back()} className="w-8 h-8 items-center justify-center">
            <Text className="text-white text-lg">‹</Text>
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-base font-bold">Report {report.refCode}</Text>
            <Text className="text-white/50 text-xs mt-0.5">{report.category} Maintenance</Text>
          </View>
        </View>
        <View className="w-10 h-10 rounded-full bg-mustard/60 items-center justify-center">
          <Text className="text-ink text-xs font-bold">{CURRENT_ADMIN.initials}</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-6 py-5" showsVerticalScrollIndicator={false}>
        {report.photoUri ? (
          <Image source={{ uri: report.photoUri }} style={{ width: '100%', height: 180, borderRadius: 12 }} className="mb-4" />
        ) : (
          <View className="bg-mustard/10 rounded-xl items-center justify-center py-10 mb-4">
            <OutlineIcon name={categoryIconName(report.category)} size={38} color="#A1000B" />
          </View>
        )}

        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-8 h-8 rounded-full bg-maroon items-center justify-center">
            <Text className="text-white text-xs font-bold">{report.reportedBy.charAt(0)}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-ink text-xs font-semibold">{report.reportedBy}</Text>
          </View>
          <Text className="text-ink/40 text-[11px]">{report.reportedAt}</Text>
        </View>

        <Text className="text-ink/50 text-xs font-semibold mb-1">Location</Text>
        <Text className="text-ink text-sm mb-3">
          {report.building}, Room {report.room}
        </Text>

        <Text className="text-ink/50 text-xs font-semibold mb-1">Urgency</Text>
        <Text className="text-ink text-sm mb-3">{report.urgency}</Text>

        <Text className="text-ink/50 text-xs font-semibold mb-1">Description</Text>
        <Text className="text-ink/80 text-sm leading-5 mb-5">{report.description}</Text>

        <Text className="text-ink text-sm font-bold mb-3">Tracking Status</Text>
        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-5">
          {steps.map((s, i) => (
            <View key={s.label} className={`flex-row gap-3 ${i < steps.length - 1 ? 'mb-4' : ''}`}>
              <View className={`w-6 h-6 rounded-full items-center justify-center ${s.done ? 'bg-maroon' : 'bg-ink/10'}`}>
                <Text className={`text-[11px] ${s.done ? 'text-white' : 'text-ink/40'}`}>{s.done ? '✓' : ''}</Text>
              </View>
              <View>
                <Text className={`text-xs font-semibold ${s.done ? 'text-ink' : 'text-ink/40'}`}>{s.label}</Text>
                {!!s.sub && <Text className="text-ink/40 text-[11px] mt-0.5">{s.sub}</Text>}
              </View>
            </View>
          ))}
        </View>

        <View className="bg-white border border-ink/10 rounded-xl p-4">
          <Text className="text-ink text-sm font-bold mb-4">Admin Action panel</Text>

          <Text className="text-ink/50 text-xs mb-1.5">Assigned To</Text>
          <TextInput
            value={assignedStaff}
            onChangeText={setAssignedStaff}
            placeholder="Type a name..."
            placeholderTextColor="#8A7B7E"
            className="bg-[#F4F1EC] border border-ink/10 rounded-lg px-4 py-3 text-ink text-sm mb-2"
          />
          {assignmentChanged && (
            <Pressable onPress={saveAssignment} disabled={saving} className="bg-[#151824] rounded-lg py-2.5 items-center mb-4">
              <Text className="text-white text-xs font-semibold">{saving ? 'Saving...' : 'Save Assignment'}</Text>
            </Pressable>
          )}

          {nextStatus && (
            <Pressable onPress={advanceStatus} disabled={saving} className="bg-maroon rounded-xl py-3.5 items-center">
              <Text className="text-white font-semibold text-sm">
                {saving ? 'Updating...' : `Mark as ${nextStatus}`}
              </Text>
            </Pressable>
          )}
          {!nextStatus && (
            <View className="bg-green-50 rounded-xl py-3.5 items-center">
              <Text className="text-green-700 font-semibold text-sm">Report Resolved</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}