import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '@/lib/theme';

export function ProgressBar({ value, color = theme.colors.success, height = 16 }: { value: number; color?: string; height?: number }) {
  const anim = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: Math.max(0, Math.min(1, value)), duration: 300, useNativeDriver: false }).start();
  }, [value, anim]);

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            borderRadius: height / 2,
            width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    backgroundColor: theme.colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
