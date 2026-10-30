import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/lib/theme';

export function StatPill({
  icon,
  color,
  value,
  testID,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  value: string | number;
  testID?: string;
}) {
  return (
    <View style={styles.pill} testID={testID}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
  },
});
