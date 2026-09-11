import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';
import { useAnnouncements } from '@/context/announcements-context';
import { useAppAlert } from '@/components/app-alert';

function initialsFor(name?: string) {
  if (!name) return 'A';
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminAnnouncementsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { announcements, isLoading, createAnnouncement, deleteAnnouncement } = useAnnouncements();
  const { showAlert } = useAppAlert();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      showAlert('Missing info', 'Please add both a title and a message.');
      return;
    }
    setSubmitting(true);
    try {
      await createAnnouncement(title.trim(), message.trim());
      setTitle('');
      setMessage('');
    } catch (err: any) {
      showAlert('Failed', err.response?.data?.message || 'Could not post announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    showAlert('Delete Announcement?', 'Students will no longer see this update.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAnnouncement(id) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EC]">
      <View className="bg-[#151824] px-6 pt-4 pb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">Announcements</Text>
          <Text className="text-white/50 text-xs mt-0.5">Post updates students will see</Text>
        </View>
        <Pressable
          onPress={() => router.push('/profile')}
          className="w-10 h-10 rounded-full bg-mustard/60 items-center justify-center overflow-hidden"
        >
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={{ width: 40, height: 40 }} />
          ) : (
            <Text className="text-ink text-xs font-bold">{initialsFor(user?.name)}</Text>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="px-6 py-5" showsVerticalScrollIndicator={false}>
        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-5">
          <Text className="text-ink text-sm font-bold mb-3">New Announcement</Text>
          <Text className="text-ink/50 text-xs mb-1.5">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Water Main Repairs — North Dorms"
            placeholderTextColor="#8A7B7E"
            className="bg-[#F4F1EC] border border-ink/10 rounded-lg px-4 py-3 text-ink text-sm mb-3"
          />
          <Text className="text-ink/50 text-xs mb-1.5">Message</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Details students should know..."
            placeholderTextColor="#8A7B7E"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="bg-[#F4F1EC] border border-ink/10 rounded-lg px-4 py-3 text-ink text-sm mb-4 h-20"
          />
          <Pressable onPress={handleSubmit} disabled={submitting} className="bg-maroon rounded-lg py-3 items-center">
            <Text className="text-white text-xs font-semibold">{submitting ? 'Posting...' : 'Post Announcement'}</Text>
          </Pressable>
        </View>

        <Text className="text-ink text-sm font-bold mb-3">Posted Announcements</Text>
        {isLoading && <Text className="text-ink/50 text-xs">Loading...</Text>}
        <View className="gap-3">
          {announcements.map((a) => (
            <View key={a.id} className="bg-white border border-ink/10 rounded-xl p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-ink text-sm font-semibold">{a.title}</Text>
                  <Text className="text-ink/60 text-xs mt-0.5 leading-4">{a.body}</Text>
                  <Text className="text-ink/35 text-[11px] mt-1">{a.date}</Text>
                </View>
                <Pressable onPress={() => handleDelete(a.id)}>
                  <Text className="text-maroon text-xs font-semibold">Delete</Text>
                </Pressable>
              </View>
            </View>
          ))}
          {!isLoading && announcements.length === 0 && (
            <Text className="text-ink/40 text-xs text-center mt-4">No announcements posted yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}