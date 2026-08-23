import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CURRENT_ADMIN } from '@/data/current-user';
import { useStaff } from '@/context/staff-context';
import { useAppAlert } from '@/components/app-alert';

const STATUS_COLOR: Record<string, string> = {
  Available: '#22C55E',
  Busy: '#E3A72F',
  'Off-duty': '#9B8B8E',
};

export default function AdminTeamScreen() {
  const { staff, addStaff } = useStaff();
  const { showAlert } = useAppAlert();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const onDuty = staff.filter((s) => s.status !== 'Off-duty').length;

  const handleAddStaff = () => {
    if (!name.trim() || !role.trim()) {
      showAlert('Missing info', 'Please enter both a name and a role.');
      return;
    }
    addStaff(name.trim(), role.trim());
    showAlert('Staff added', `${name.trim()} has been added to the team.`);
    setName('');
    setRole('');
    setShowForm(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EC]">
      <View className="bg-[#151824] px-6 pt-4 pb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">Maintenance Team</Text>
          <Text className="text-white/50 text-xs mt-0.5">Staff Status &amp; Workload Dispatch</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-mustard/60 items-center justify-center">
          <Text className="text-ink text-xs font-bold">{CURRENT_ADMIN.initials}</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-6 py-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-ink text-sm font-semibold">{onDuty} Staff On-duty</Text>
          <Pressable
            onPress={() => setShowForm((v) => !v)}
            className="bg-mustard/25 px-3 py-1.5 rounded-full"
          >
            <Text className="text-orange-700 text-xs font-semibold">
              {showForm ? 'Cancel' : '+ Add Staff'}
            </Text>
          </Pressable>
        </View>

        {showForm && (
          <View className="bg-white border border-ink/10 rounded-xl p-4 mb-4">
            <Text className="text-ink/50 text-xs mb-1.5">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Ana Reyes"
              placeholderTextColor="#8A7B7E"
              className="bg-[#F4F1EC] border border-ink/10 rounded-lg px-4 py-3 text-ink text-sm mb-3"
            />
            <Text className="text-ink/50 text-xs mb-1.5">Role</Text>
            <TextInput
              value={role}
              onChangeText={setRole}
              placeholder="e.g. Carpenter"
              placeholderTextColor="#8A7B7E"
              className="bg-[#F4F1EC] border border-ink/10 rounded-lg px-4 py-3 text-ink text-sm mb-4"
            />
            <Pressable onPress={handleAddStaff} className="bg-maroon rounded-lg py-3 items-center">
              <Text className="text-white text-xs font-semibold">Add to Team</Text>
            </Pressable>
          </View>
        )}

        <View className="gap-3">
          {staff.map((s) => (
            <View key={s.id} className="flex-row items-center gap-3 bg-white border border-ink/10 rounded-xl p-4">
              <View className="w-11 h-11 rounded-full bg-mustard/25 items-center justify-center">
                <Text className="text-ink text-xs font-bold">
                  {s.name.split(' ').map((n) => n[0]).join('')}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-ink text-sm font-semibold">{s.name}</Text>
                <Text className="text-ink/50 text-xs">{s.role}</Text>
                <View className="flex-row items-center gap-1.5 mt-1">
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: STATUS_COLOR[s.status] }} />
                  <Text className="text-ink/40 text-[11px]">{s.status}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-maroon text-lg font-bold">{s.activeJobs}</Text>
                <Text className="text-ink/40 text-[10px]">Active Jobs</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
