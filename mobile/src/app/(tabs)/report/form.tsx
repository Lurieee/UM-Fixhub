import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useReports, Urgency } from '@/context/reports-context';
import { useAppAlert } from '@/components/app-alert';

const URGENCY_LEVELS: Urgency[] = ['Low', 'Medium', 'High'];

export default function ReportFormScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { addReport } = useReports();
  const { showAlert } = useAppAlert();

  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('Medium');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showAlert('Camera permission needed', 'Enable camera access in your device settings to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: true });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const openLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showAlert('Photo access needed', 'Enable photo library access in your device settings to upload a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsEditing: true });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handlePickPhoto = () => {
    showAlert('Add a Photo', 'How would you like to add a photo?', [
      { text: 'Take Photo', onPress: openCamera },
      { text: 'Choose from Library', onPress: openLibrary },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = () => {
    if (!title.trim() || !building.trim() || !description.trim()) {
      showAlert('Missing info', 'Please add a short title, location, and description.');
      return;
    }
    const report = addReport({
      title: title.trim(),
      category: category ?? 'Other',
      building,
      room,
      description,
      urgency,
      photoUri,
    });
    router.push({ pathname: '/report/submitted', params: { id: report.id } });
  };

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 mt-3 mb-5">
          <Pressable
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-mustard/20 items-center justify-center"
          >
            <Text className="text-ink text-lg">‹</Text>
          </Pressable>
          <Text className="text-ink text-xl font-bold">Report Issue</Text>
        </View>

        <View className="flex-row items-center justify-between bg-mustard/20 rounded-lg px-4 py-3 mb-5">
          <Text className="text-ink text-xs font-semibold">Category: {category ?? 'Other'}</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-maroon text-xs font-semibold">Change</Text>
          </Pressable>
        </View>

        <Text className="text-ink text-sm font-medium mb-1.5">Issue title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Broken air conditioner"
          placeholderTextColor="#8A7B7E"
          maxLength={80}
          className="bg-white border border-ink/10 rounded-xl px-4 py-3.5 text-ink mb-4"
        />

        <Text className="text-ink text-sm font-medium mb-1.5">Where is the issue?</Text>
        <View className="flex-row gap-3 mb-4">
          <TextInput
            value={building}
            onChangeText={setBuilding}
            placeholder="Building"
            placeholderTextColor="#8A7B7E"
            className="flex-1 bg-white border border-ink/10 rounded-xl px-4 py-3.5 text-ink"
          />
          <TextInput
            value={room}
            onChangeText={setRoom}
            placeholder="Room"
            placeholderTextColor="#8A7B7E"
            style={{ width: 90 }}
            className="bg-white border border-ink/10 rounded-xl px-4 py-3.5 text-ink"
          />
        </View>

        <Text className="text-ink text-sm font-medium mb-1.5">Add a Photo</Text>
        {photoUri ? (
          <Pressable onPress={handlePickPhoto} className="mb-4">
            <Image source={{ uri: photoUri }} style={{ width: '100%', height: 160, borderRadius: 12 }} />
            <View className="absolute top-2 right-2 bg-black/60 rounded-full px-2.5 py-1">
              <Text className="text-white text-[10px] font-semibold">Change</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable
            onPress={handlePickPhoto}
            className="border border-dashed border-maroon/50 rounded-xl items-center justify-center py-8 mb-4"
          >
            <Text className="text-2xl mb-1">📷</Text>
            <Text className="text-maroon text-xs font-semibold">Take photo or upload</Text>
            <Text className="text-ink/40 text-[11px] mt-0.5">JPEG, PNG up to 10MB</Text>
          </Pressable>
        )}

        <Text className="text-ink text-sm font-medium mb-1.5">Describe the issue</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What's wrong, and how urgent is it?"
          placeholderTextColor="#8A7B7E"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="bg-white border border-ink/10 rounded-xl px-4 py-3.5 text-ink mb-4 h-24"
        />

        <Text className="text-ink text-sm font-medium mb-1.5">Urgency Level</Text>
        <View className="flex-row bg-white border border-ink/10 rounded-xl p-1 mb-6">
          {URGENCY_LEVELS.map((level) => {
            const active = urgency === level;
            return (
              <Pressable
                key={level}
                onPress={() => setUrgency(level)}
                className={`flex-1 py-2.5 rounded-lg items-center ${active ? 'bg-maroon' : ''}`}
              >
                <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-ink/60'}`}>
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={handleSubmit} className="bg-maroon rounded-xl py-3.5 items-center">
          <Text className="text-white font-semibold">Submit Report</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
