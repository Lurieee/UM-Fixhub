import { Link, Stack } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
        <Text className="text-5xl mb-4">🔧</Text>
        <Text className="text-ink text-lg font-bold mb-2">This screen doesn&apos;t exist.</Text>
        <Text className="text-ink/50 text-sm text-center mb-6">
          The page you&apos;re looking for isn&apos;t part of UM Fixhub.
        </Text>
        <Link href="/" className="text-maroon text-sm font-semibold">
          Go back home
        </Link>
      </SafeAreaView>
    </>
  );
}
