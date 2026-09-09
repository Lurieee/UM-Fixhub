import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppAlertProvider } from '@/components/app-alert';
import { AuthProvider } from '@/context/auth-context';
import { ReportsProvider } from '@/context/reports-context';
import { AnnouncementsProvider } from '@/context/announcements-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <AnnouncementsProvider>
          <AppAlertProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(admin)" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </AppAlertProvider>
        </AnnouncementsProvider>
      </ReportsProvider>
    </AuthProvider>
  );
}