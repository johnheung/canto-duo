import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speak } from '@/lib/speech';
import { theme } from '@/lib/theme';

interface SpeakerButtonProps {
  text: string;
  enabled: boolean;
  size?: 'md' | 'lg';
  autoPlay?: boolean;
  slow?: boolean;
}

export function SpeakerButton({ text, enabled, size = 'md', autoPlay, slow }: SpeakerButtonProps) {
  useEffect(() => {
    if (enabled && autoPlay) speak(text);
  }, [text, enabled, autoPlay]);

  if (!enabled) return null;
  const dim = size === 'lg' ? 88 : 48;
  return (
    <Pressable
      accessibilityLabel={slow ? 'Play slowly' : 'Play audio'}
      onPress={() => speak(text, slow)}
      style={({ pressed }) => [
        styles.button,
        { width: dim, height: dim, borderRadius: size === 'lg' ? theme.radius.lg : theme.radius.md },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={slow ? 'hourglass-outline' : 'volume-high'} size={size === 'lg' ? 40 : 24} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    borderBottomWidth: 1,
    transform: [{ translateY: 3 }],
  },
});
