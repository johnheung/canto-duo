import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/lib/theme';

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'done';

interface OptionCardProps {
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const BORDER: Record<OptionState, string> = {
  idle: theme.colors.border,
  selected: theme.colors.primary,
  correct: theme.colors.success,
  wrong: theme.colors.danger,
  done: theme.colors.surfaceAlt,
};

const BG: Record<OptionState, string> = {
  idle: theme.colors.surface,
  selected: '#123A37',
  correct: theme.colors.successBg,
  wrong: theme.colors.dangerBg,
  done: theme.colors.background,
};

export function OptionCard({ state, onPress, disabled, children, style, testID }: OptionCardProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || state === 'done'}
      style={({ pressed }) => [
        styles.card,
        { borderColor: BORDER[state], backgroundColor: BG[state], opacity: state === 'done' ? 0.35 : 1 },
        pressed && styles.pressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }],
  },
});
