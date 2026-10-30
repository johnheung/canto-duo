import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ProgressProvider } from '@/lib/context/ProgressContext';
import { detectCantoneseVoice } from '@/lib/speech';
import { theme } from '@/lib/theme';

export default function RootLayout() {
  useEffect(() => {
    detectCantoneseVoice();
  }, []);

  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="lesson/[id]" options={{ gestureEnabled: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="lesson/complete" options={{ gestureEnabled: false, animation: 'fade' }} />
        </Stack>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
