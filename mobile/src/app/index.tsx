import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutlineIcon, OutlineIconName } from '@/components/outline-icon';

const features = [
  {
    icon: 'camera-outline' as OutlineIconName,
    title: 'Report Issues Instantly',
    description: "Snap a picture of the broken item, set location, and submit under 30 seconds.",
  },
  {
    icon: 'clock-outline' as OutlineIconName,
    title: 'Track Repairs in Real-Time',
    description: "Monitor status updates from 'Received' to 'Resolved' directly on your dashboard.",
  },
  {
    icon: 'shield-check-outline' as OutlineIconName,
    title: 'Keep Campus Safe',
    description: 'Prevent hazards by flagging immediate electrical, plumbing, or infrastructure faults.',
  },
];

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pb-6 items-center"
        showsVerticalScrollIndicator={false}
      >
        {/* Header wordmark */}
        <View className="flex-row items-center gap-2 mt-2 mb-5">
          <View className="w-8 h-8 rounded-lg bg-maroon items-center justify-center">
            <OutlineIcon name="wrench-outline" size={17} color="#E3A72F" />
          </View>
          <Text className="text-ink text-lg font-bold">UM Fixhub</Text>
        </View>

        <View className="w-full h-44 rounded-2xl bg-maroon mb-6 items-center justify-center overflow-hidden">
          <Image source={require('@/assets/images/icon.png')} style={{ width: 150, height: 150 }} resizeMode="contain" />
          <View className="absolute bottom-3 left-4 right-4">
            <Text className="text-white text-xs font-semibold">University of Mindanao facilities</Text>
            <Text className="text-white/70 text-[11px] mt-0.5">Report it. Track it. Fix it.</Text>
          </View>
        </View>

        {/* Headline */}
        <View className="w-full mb-5">
          <Text className="text-ink text-2xl font-bold leading-tight">
            Keep your campus working beautifully
          </Text>
          <Text className="text-ink/60 text-sm mt-2 leading-5">
            Join hands with the facility maintenance team to report structural and utility issues instantly.
          </Text>
        </View>

        {/* Feature list */}
        <View className="w-full gap-4 mb-8">
          {features.map((f) => (
            <View key={f.title} className="flex-row gap-3 items-start">
              <View className="w-10 h-10 rounded-full bg-mustard/20 items-center justify-center">
                <OutlineIcon name={f.icon} size={21} color="#A1000B" />
              </View>
              <View className="flex-1">
                <Text className="text-ink font-semibold text-sm">{f.title}</Text>
                <Text className="text-ink/60 text-xs mt-0.5 leading-4">{f.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <Pressable
          onPress={() => router.push('/signup')}
          className="w-full bg-maroon py-3.5 rounded-xl mb-3"
        >
          <Text className="text-white font-semibold text-center">Create Student Account</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/login')}
          className="w-full bg-white py-3.5 rounded-xl border border-ink/10"
        >
          <Text className="text-ink font-semibold text-center">Sign In to Your Account</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}