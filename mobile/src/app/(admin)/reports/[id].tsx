import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryIconName } from '@/data/categories';
import { useReports, ReportStatus, Urgency } from '@/context/reports-context';
import { CURRENT_ADMIN } from '@/data/current-user';
import { useStaff } from '@/context/staff-context';
import { OutlineIcon } from '@/components/outline-icon';
import { useAppAlert } from '@/components/app-alert';

const URGENCY_LEVELS: Urgency[] = ['Low', 'Medium', 'High'];
const STATUS_LEVELS: ReportStatus[] = ['Submitted', 'In Progress', 'Resolved'];

function Dropdown({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View className="mb-3">
      <Text className="text-ink/50 text-xs mb-1.5">{label}</Text>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        className="flex-row items-center justify-between bg-[#F4F1EC] border border-ink/10 rounded-lg px-4 py-3"
      >
        <Text className="text-ink text-xs font-semibold">{value}</Text>
        <Text className="text-ink/40 text-xs">{open ? '▲' : '▼'}</Text>
      </Pressable>
      {open && (
        <View className="border border-ink/10 rounded-lg mt-1 overflow-hidden">
          {options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className={`px-4 py-3 ${opt === value ? 'bg-mustard/15' : 'bg-white'}`}
            >
              <Text className="text-ink text-xs">{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function AdminReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getReport, updateReport } = useReports();
  const { staffOptions } = useStaff();
  const { showAlert } = useAppAlert();
  const report = getReport(id);

  const [staff, setStaff] = useState(report?.assignedStaff ?? 'Unassigned');
  const [urgency, setUrgency] = useState<Urgency>(report?.urgency ?? 'Medium');
  const [status, setStatus] = useState<ReportStatus>(report?.status ?? 'Submitted');

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-[#F4F1EC] items-center justify-center">
        <Text className="text-ink/60">Report not found.</Text>
      </SafeAreaView>
    );
  }

  const handleUpdate = () => {
    updateReport(report.id, {
      status,
      urgency,
      assignedStaff: staff === 'Unassigned' ? null : staff,
    });
    showAlert('Report updated', 'Status, urgency, and assignment saved.');
    router.back();
  };

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

        <Text className="text-ink/50 text-xs font-semibold mb-1">Description</Text>
        <Text className="text-ink/80 text-sm leading-5 mb-5">{report.description}</Text>

        <View className="bg-white border border-ink/10 rounded-xl p-4">
          <Text className="text-ink text-sm font-bold mb-4">Admin Action panel</Text>

          <Dropdown label="Assign Staff / Team" value={staff} options={['Unassigned', ...staffOptions]} onSelect={setStaff} />

          <Text className="text-ink/50 text-xs mb-1.5">Urgency</Text>
          <View className="flex-row bg-[#F4F1EC] border border-ink/10 rounded-lg p-1 mb-3">
            {URGENCY_LEVELS.map((level) => {
              const active = urgency === level;
              return (
                <Pressable
                  key={level}
                  onPress={() => setUrgency(level)}
                  className={`flex-1 py-2 rounded-md items-center ${active ? 'bg-maroon' : ''}`}
                >
                  <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-ink/60'}`}>
                    {level}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="text-ink/50 text-xs mb-1.5">Status</Text>
          <View className="flex-row bg-[#F4F1EC] border border-ink/10 rounded-lg p-1 mb-5">
            {STATUS_LEVELS.map((level) => {
              const active = status === level;
              return (
                <Pressable
                  key={level}
                  onPress={() => setStatus(level)}
                  className={`flex-1 py-2 rounded-md items-center ${active ? 'bg-[#151824]' : ''}`}
                >
                  <Text className={`text-[11px] font-semibold ${active ? 'text-white' : 'text-ink/60'}`}>
                    {level === 'Submitted' ? 'Pending' : level}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable onPress={handleUpdate} className="bg-maroon rounded-xl py-3.5 items-center">
            <Text className="text-white font-semibold text-sm">Assign &amp; Update Report</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
