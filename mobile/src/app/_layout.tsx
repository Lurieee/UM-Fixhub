import '../global.css';

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { AppAlertProvider } from '@/components/app-alert';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { ReportsProvider } from '@/context/reports-context';
import { AnnouncementsProvider } from '@/context/announcements-context';

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const inAdminGroup = segments[0] === '(admin)';

    if (!user && (inTabsGroup || inAdminGroup)) {
      router.replace('/login');
      return;
    }

    if (user && inAdminGroup && user.role !== 'admin') {
      router.replace('/home');
      return;
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF7F2' }}>
        <ActivityIndicator color="#A1000B" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <AnnouncementsProvider>
          <AppAlertProvider>
            <StatusBar style="dark" />
            <RouteGuard>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(admin)" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </RouteGuard>
          </AppAlertProvider>
        </AnnouncementsProvider>
      </ReportsProvider>
    </AuthProvider>
  );
}