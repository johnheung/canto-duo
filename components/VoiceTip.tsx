import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '@/lib/context/ProgressContext';
import { ANDROID_VOICE_STEPS, useCantoneseVoice } from '@/lib/speech';
import { theme } from '@/lib/theme';

/** One-time tip shown when the phone has no Cantonese voice installed. */
export function VoiceTip() {
  const { state, updateSettings } = useProgress();
  const { voice } = useCantoneseVoice();

  if (voice !== null || !state.settings.sound || state.settings.voiceTipDismissed) return null;

  return (
    <View style={styles.tip} testID="voice-tip">
      <Ionicons name="volume-mute" size={22} color={theme.colors.accent} />
      <View style={styles.text}>
        <Text style={styles.title}>Install a Cantonese voice for audio</Text>
        <Text style={styles.detail}>{ANDROID_VOICE_STEPS}</Text>
      </View>
      <Pressable
        testID="voice-tip-dismiss"
        accessibilityLabel="Dismiss"
        hitSlop={12}
        onPress={() => updateSettings({ voiceTipDismissed: true })}
      >
        <Ionicons name="close" size={22} color={theme.colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(4),
  },
  text: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  detail: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
});
