import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/lib/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  testID?: string;
}

const COLORS = {
  primary: [theme.colors.primary, theme.colors.primaryDark],
  success: [theme.colors.success, theme.colors.successDark],
  danger: [theme.colors.danger, theme.colors.dangerDark],
  secondary: [theme.colors.surfaceAlt, theme.colors.border],
} as const;

/** Chunky button with a raised bottom edge that presses down. */
export function Button({ label, onPress, variant = 'primary', disabled, testID }: ButtonProps) {
  const [face, edge] = disabled ? [theme.colors.surfaceAlt, theme.colors.border] : COLORS[variant];
  const textColor = disabled ? theme.colors.textMuted : variant === 'secondary' ? theme.colors.text : '#FFFFFF';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: face, borderBottomColor: edge },
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.md,
    borderBottomWidth: 4,
    paddingVertical: theme.spacing(3.5),
    paddingHorizontal: theme.spacing(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  pressed: {
    borderBottomWidth: 1,
    transform: [{ translateY: 3 }],
  },
});
