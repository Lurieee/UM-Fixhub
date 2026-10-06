import { useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, Text, View } from 'react-native';

type Entry = { name: string; numbers: string[] };
type Group = { category: string; entries: Entry[] };

const CONTACTS: Group[] = [
  {
    category: 'Fire Department',
    entries: [
      { name: 'Davao City Central Fire Station', numbers: ['224-0524'] },
      { name: 'S.I.R Fire Station', numbers: ['296-1779'] },
      { name: 'Talomo Fire Station', numbers: ['297-2427', '222324'] },
      { name: 'Davao Volunteers', numbers: ['226-4835'] },
      { name: 'Bangoy', numbers: ['221-0221'] },
    ],
  },
  {
    category: 'Police Station',
    entries: [
      { name: 'Davao City Police Office', numbers: ['09258233276'] },
      { name: 'Sta. Ana Police Station', numbers: ['233-4884', '09985987055'] },
      { name: 'San Pedro Police Station', numbers: ['226-4835', '09985987057'] },
      { name: 'PNP Camp Leonor (DCPO)', numbers: ['226-8911'] },
      { name: 'Talomo Police Station', numbers: ['297-1598', '09194439634'] },
      { name: 'DCPO - Technical Support (IED)', numbers: ['283-3769', '296-2359'] },
      { name: 'Ecoland Police Station 15', numbers: ['09123611960'] },
    ],
  },
  {
    category: 'Communication Response Center',
    entries: [
      { name: 'Davao City Communication Response Center', numbers: ['911'] },
    ],
  },
  {
    category: 'Hospitals',
    entries: [
      { name: 'Davao Medical Hospital', numbers: ['227-2731'] },
      { name: 'Davao Doctors Hospital', numbers: ['221-2101'] },
      { name: 'Brokenshire Hospital', numbers: ['305-3170'] },
      { name: 'San Pedro Hospital', numbers: ['222-6100'] },
    ],
  },
  {
    category: 'Utilities & City Services',
    entries: [
      { name: 'Davao City Water District', numbers: ['227-9400'] },
      { name: 'Davao Light & Power Company', numbers: ['229-3572'] },
      { name: 'City Disaster Office', numbers: ['295-2387'] },
      { name: 'City Transport & Traffic Management', numbers: ['298-3602'] },
      { name: 'Traffic Group', numbers: ['296-0771'] },
    ],
  },
];

function call(number: string) {
  Linking.openURL(`tel:${number.replace(/[^\d]/g, '')}`);
}

export function EmergencyContacts() {
  const [open, setOpen] = useState(false);

  return (
    <View className="bg-ink rounded-2xl p-5">
      <Text className="text-white font-bold text-base">Need immediate help?</Text>
      <Text className="text-white/50 text-xs mt-1 mb-3">For urgent security issues or building emergencies.</Text>
      <Pressable onPress={() => call('911')} className="bg-maroon rounded-xl py-3 items-center mb-2">
        <Text className="text-white text-sm font-bold">Contact Emergency Services</Text>
      </Pressable>
      <Pressable onPress={() => setOpen(true)} className="border border-white/15 rounded-xl py-3 items-center">
        <Text className="text-white/70 text-sm font-bold">View All Emergency Contacts</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View className="flex-1 bg-black/45 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
            <View className="flex-row items-start justify-between mb-1">
              <Text className="text-ink text-lg font-extrabold">Emergency Contacts</Text>
              <Pressable onPress={() => setOpen(false)} className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center">
                <Text className="text-ink text-base">✕</Text>
              </Pressable>
            </View>
            <Text className="text-ink/40 text-xs mb-4">Davao City emergency and utility hotlines</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {CONTACTS.map((group) => (
                <View key={group.category} className="mb-5">
                  <Text className="text-maroon text-xs font-extrabold uppercase mb-2">{group.category}</Text>
                  <View className="border border-slate-100 rounded-xl overflow-hidden">
                    {group.entries.map((entry, index) => (
                      <View
                        key={entry.name}
                        className={`flex-row items-center justify-between px-4 py-2.5 ${index > 0 ? 'border-t border-slate-100' : ''}`}
                      >
                        <Text className="text-ink/80 text-sm flex-1 pr-3">{entry.name}</Text>
                        <View className="flex-row flex-wrap justify-end gap-x-2">
                          {entry.numbers.map((number) => (
                            <Pressable key={number} onPress={() => call(number)}>
                              <Text className="text-maroon text-sm font-bold">{number}</Text>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}