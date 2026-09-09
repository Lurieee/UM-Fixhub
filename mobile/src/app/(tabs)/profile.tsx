import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { useAppAlert } from '@/components/app-alert';

function initialsFor(name?: string) {
  if (!name) return 'U';
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatMemberSince(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const { showAlert } = useAppAlert();
  const [uploading, setUploading] = useState(false);

  const [setupData, setSetupData] = useState<{ secret: string; otpauth_url: string } | null>(null);
  const [code, setCode] = useState('');
  const [twoFactorBusy, setTwoFactorBusy] = useState(false);

  if (!user) return null;

  const memberSince = formatMemberSince(user.created_at);

  const pickAndUploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showAlert('Photo access needed', 'Enable photo library access in your device settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsEditing: true });
    if (result.canceled) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const filename = asset.uri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const formData = new FormData();
      formData.append('photo', { uri: asset.uri, name: filename, type } as any);

      const { data } = await api.post('/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await updateUser(data);
    } catch (err: any) {
      showAlert('Upload failed', err.response?.data?.message || 'Could not upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const startTwoFactorSetup = async () => {
    setTwoFactorBusy(true);
    try {
      const { data } = await api.post('/2fa/generate');
      setSetupData(data);
    } catch {
      showAlert('Error', 'Could not start setup. Try again.');
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const confirmTwoFactor = async () => {
    setTwoFactorBusy(true);
    try {
      await api.post('/2fa/confirm', { code });
      setSetupData(null);
      setCode('');
      await updateUser({ ...user, two_factor_enabled: true });
      showAlert('Enabled', 'Two-factor authentication is now on.');
    } catch (err: any) {
      showAlert('Invalid code', err.response?.data?.message || 'Please try again.');
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const disableTwoFactor = async () => {
    setTwoFactorBusy(true);
    try {
      await api.post('/2fa/disable');
      await updateUser({ ...user, two_factor_enabled: false });
    } catch {
      showAlert('Error', 'Could not disable 2FA. Try again.');
    } finally {
      setTwoFactorBusy(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 mt-3 mb-6">
          <Pressable onPress={() => router.back()} className="w-8 h-8 items-center justify-center">
            <Text className="text-ink text-xl">‹</Text>
          </Pressable>
          <Text className="text-ink text-xl font-bold">My Profile</Text>
        </View>

        {/* Avatar + name */}
        <View className="items-center mb-6">
          <Pressable onPress={pickAndUploadPhoto} className="mb-2">
            {user.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={{ width: 96, height: 96, borderRadius: 48 }} />
            ) : (
              <View className="w-24 h-24 rounded-full bg-maroon items-center justify-center">
                <Text className="text-white text-2xl font-bold">{initialsFor(user.name)}</Text>
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-mustard rounded-full px-2 py-1">
              <Text className="text-ink text-[10px] font-bold">{uploading ? '...' : 'Edit'}</Text>
            </View>
          </Pressable>
          <Text className="text-ink text-xl font-bold mt-2">{user.name}</Text>
          <Text className="text-ink/60 text-xs">{user.email}</Text>
        </View>

        {/* Account info */}
        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-4">
          <Text className="text-ink text-sm font-bold mb-3">Account Information</Text>
          {user.student_id && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-ink/50 text-xs">Student ID</Text>
              <Text className="text-ink text-xs font-semibold">{user.student_id}</Text>
            </View>
          )}
          <View className="flex-row justify-between mb-2">
            <Text className="text-ink/50 text-xs">Account Type</Text>
            <Text className="text-ink text-xs font-semibold">{user.role === 'admin' ? 'Administrator' : 'Student'}</Text>
          </View>
          {memberSince && (
            <View className="flex-row justify-between">
              <Text className="text-ink/50 text-xs">Member Since</Text>
              <Text className="text-ink text-xs font-semibold">{memberSince}</Text>
            </View>
          )}
        </View>

        {/* 2FA */}
        <View className="bg-white border border-ink/10 rounded-xl p-4 mb-6">
          <Text className="text-ink text-sm font-bold mb-1">Two-Factor Authentication</Text>
          <Text className="text-ink/50 text-xs mb-3">Add an extra layer of security using an authenticator app.</Text>

          {user.two_factor_enabled && !setupData && (
            <View className="flex-row items-center justify-between bg-green-50 rounded-lg px-4 py-3">
              <Text className="text-green-700 text-xs font-semibold">Enabled</Text>
              <Pressable onPress={disableTwoFactor} disabled={twoFactorBusy}>
                <Text className="text-maroon text-xs font-semibold">Disable</Text>
              </Pressable>
            </View>
          )}

          {!user.two_factor_enabled && !setupData && (
            <Pressable onPress={startTwoFactorSetup} disabled={twoFactorBusy} className="bg-maroon rounded-lg py-3 items-center">
              <Text className="text-white text-xs font-semibold">
                {twoFactorBusy ? 'Starting...' : 'Enable Two-Factor Authentication'}
              </Text>
            </Pressable>
          )}

          {setupData && (
            <View>
              <Text className="text-ink/60 text-xs mb-3">Scan this with your authenticator app:</Text>
              <View className="items-center bg-[#F4F1EC] rounded-xl py-6 mb-3">
                <QRCode value={setupData.otpauth_url} size={160} />
              </View>
              <Text className="text-ink/40 text-[11px] mb-3">Or enter manually: {setupData.secret}</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor="#8A7B7E"
                keyboardType="number-pad"
                maxLength={6}
                className="bg-[#F4F1EC] border border-ink/10 rounded-lg px-4 py-3 text-ink text-sm mb-3"
              />
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => { setSetupData(null); setCode(''); }}
                  className="flex-1 border border-ink/10 rounded-lg py-3 items-center"
                >
                  <Text className="text-ink text-xs font-semibold">Cancel</Text>
                </Pressable>
                <Pressable onPress={confirmTwoFactor} disabled={twoFactorBusy} className="flex-1 bg-maroon rounded-lg py-3 items-center">
                  <Text className="text-white text-xs font-semibold">
                    {twoFactorBusy ? 'Confirming...' : 'Confirm'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <Pressable onPress={handleLogout} className="bg-white border border-ink/10 rounded-xl py-3.5 items-center">
          <Text className="text-maroon font-semibold text-sm">Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}