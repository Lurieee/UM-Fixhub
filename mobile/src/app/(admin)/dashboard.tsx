import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CURRENT_ADMIN } from '@/data/current-user';
import { useReports } from '@/context/reports-context';
import { useStaff } from '@/context/staff-context';
import { useAppAlert } from '@/components/app-alert';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { reports, updateReport } = useReports();
  const { staff } = useStaff();
  const { showAlert } = useAppAlert();

  const total = reports.length;
  const pending = reports.filter((r) => r.status === 'Submitted').length;
  const inProgress = reports.filter((r) => r.status === 'In Progress').length;
  const resolved = reports.filter((r) => r.status === 'Resolved').length;
  const resolvedRate = total ? Math.round((resolved / total) * 100) : 0;

  const urgentAlerts = reports.filter((r) => r.urgency === 'High' && r.status !== 'Resolved').slice(0, 2);

  const categoryCounts: Record<string, number> = { Furniture: 0, Plumbing: 0, Electrical: 0, Infrastructure: 0 };
  reports.forEach((r) => {
    if (categoryCounts[r.category] !== undefined) categoryCounts[r.category] += 1;
  });
  const maxCount = Math.max(1, ...Object.values(categoryCounts));
  const bars = [
    { key: 'Furniture', label: 'Furn.', color: '#A1000B' },
    { key: 'Plumbing', label: 'Plumb.', color: '#E3A72F' },
    { key: 'Electrical', label: 'Elec.', color: '#3B82F6' },
    { key: 'Infrastructure', label: 'AC/Heat', color: '#22C55E' },
  ];

  const handleDispatchTeam = () => {
    const unassigned = reports.filter((r) => !r.assignedStaff && r.status !== 'Resolved');
    const available = staff.filter((s) => s.status === 'Available');

    if (unassigned.length === 0) {
      showAlert('Nothing to dispatch', 'Every open report already has staff assigned.');
      return;
    }
    if (available.length === 0) {
      showAlert('No staff available', 'All staff are currently busy or off-duty.');
      return;
    }

    const pairCount = Math.min(unassigned.length, available.length);
    showAlert(
      'Dispatch Team?',
      `This will assign ${pairCount} available staff member${pairCount > 1 ? 's' : ''} to ${pairCount} unassigned report${pairCount > 1 ? 's' : ''}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dispatch',
          onPress: () => {
            for (let i = 0; i < pairCount; i++) {
              updateReport(unassigned[i].id, {
                assignedStaff: `${available[i].name} (${available[i].role})`,
                status: 'In Progress',
              });
            }
            showAlert('Team dispatched', `${pairCount} report${pairCount > 1 ? 's' : ''} assigned and moved to In Progress.`);
          },
        },
      ]
    );
  };

  const handleExportReport = () => {
    const filename = `um-fixhub-reports_${new Date().toISOString().slice(0, 10)}.csv`;
    showAlert(
      'Export Report',
      `Exporting ${total} report${total !== 1 ? 's' : ''} as "${filename}".\n\n(This is a placeholder — connecting the Laravel backend will enable a real downloadable export.)`
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EC]">
      <View className="bg-[#151824] px-6 pt-4 pb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">Admin Panel</Text>
          <Text className="text-white/50 text-xs mt-0.5">Facilities Overview</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-mustard/60 items-center justify-center">
          <Text className="text-ink text-xs font-bold">{CURRENT_ADMIN.initials}</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-6 py-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-3 mb-4">
          <View style={{ width: '47%' }} className="bg-white rounded-xl p-4 border border-ink/10">
            <Text className="text-ink/50 text-xs mb-1">Total Reports</Text>
            <Text className="text-ink text-2xl font-bold">{total}</Text>
            <Text className="text-green-600 text-[11px] mt-1">+12%</Text>
          </View>
          <View style={{ width: '47%' }} className="bg-white rounded-xl p-4 border border-ink/10">
            <Text className="text-ink/50 text-xs mb-1">Pending</Text>
            <Text className="text-ink text-2xl font-bold">{pending}</Text>
            <Text className="text-maroon text-[11px] mt-1 font-semibold">Urgent</Text>
          </View>
          <View style={{ width: '47%' }} className="bg-white rounded-xl p-4 border border-ink/10">
            <Text className="text-ink/50 text-xs mb-1">In Progress</Text>
            <Text className="text-ink text-2xl font-bold">{inProgress}</Text>
            <Text className="text-ink/40 text-[11px] mt-1">On Track</Text>
          </View>
          <View style={{ width: '47%' }} className="bg-white rounded-xl p-4 border border-ink/10">
            <Text className="text-ink/50 text-xs mb-1">Resolved</Text>
            <Text className="text-ink text-2xl font-bold">{resolved}</Text>
            <Text className="text-ink/40 text-[11px] mt-1">{resolvedRate}% rate</Text>
          </View>
        </View>

        <View className="flex-row gap-3 mb-5">
          <Pressable onPress={handleDispatchTeam} className="flex-1 bg-maroon rounded-xl py-3 items-center">
            <Text className="text-white text-xs font-semibold">⊕ Dispatch Team</Text>
          </Pressable>
          <Pressable
            onPress={handleExportReport}
            className="flex-1 bg-white border border-maroon rounded-xl py-3 items-center"
          >
            <Text className="text-maroon text-xs font-semibold">⇪ Export Report</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-ink text-sm font-semibold">⚠ High Priority Alerts</Text>
          <Pressable onPress={() => router.push({ pathname: '/reports', params: { filter: 'urgent' } })}>
            <Text className="text-maroon text-xs font-semibold">View All</Text>
          </Pressable>
        </View>
        <View className="gap-2 mb-6">
          {urgentAlerts.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/reports/${r.id}`)}
              className="flex-row items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            >
              <View className="flex-1">
                <Text className="text-ink text-xs font-semibold">{r.title}</Text>
                <Text className="text-ink/50 text-[11px] mt-0.5">
                  {r.building} {r.room} · {r.reportedAt}
                </Text>
              </View>
              <Text className="text-red-600 text-[10px] font-bold px-2 py-1 bg-red-100 rounded-full">Urgent</Text>
            </Pressable>
          ))}
          {urgentAlerts.length === 0 && (
            <Text className="text-ink/40 text-xs">No urgent items right now.</Text>
          )}
        </View>

        <View className="bg-white border border-ink/10 rounded-xl p-4">
          <Text className="text-ink text-sm font-semibold mb-4">Reports by Category</Text>
          <View className="flex-row items-end justify-between h-24">
            {bars.map((b) => {
              const count = categoryCounts[b.key];
              const height = Math.max(8, (count / maxCount) * 80);
              return (
                <View key={b.key} className="items-center gap-2">
                  <View style={{ height, width: 24, backgroundColor: b.color, borderRadius: 6 }} />
                  <Text className="text-ink/40 text-[10px]">{b.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
