import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { useProgress } from '@/lib/context/ProgressContext';
import { displayStreak, xpToday } from '@/lib/progress';
import { theme } from '@/lib/theme';

export default function CompleteScreen() {
  const params = useLocalSearchParams<{ xp?: string; accuracy?: string; kind?: string; passed?: string; failed?: string }>();
  const { state } = useProgress();
  const now = Date.now();
  const failed = params.failed === '1';
  const checkpointFailed = params.kind === 'checkpoint' && params.passed === '0';
  const pop = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [pop]);

  const today = xpToday(state, now);
  const goal = state.settings.dailyGoal;

  const title = failed
    ? 'Out of hearts'
    : checkpointFailed
      ? 'So close!'
      : params.kind === 'checkpoint'
        ? 'Unit unlocked!'
        : params.kind === 'practice'
          ? 'Practice complete!'
          : 'Lesson complete!';

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']} style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.hero}>
        <Animated.View
          style={[
            styles.badge,
            { backgroundColor: failed || checkpointFailed ? theme.colors.heart : theme.colors.accent, transform: [{ scale: pop }] },
          ]}
        >
          <Ionicons name={failed ? 'heart-dislike' : checkpointFailed ? 'refresh' : 'trophy'} size={64} color="#FFFFFF" />
        </Animated.View>
        <Text style={styles.title} testID="complete-title">
          {title}
        </Text>
        {failed ? (
          <Text style={styles.detail}>Practise to earn hearts back, then try again.</Text>
        ) : checkpointFailed ? (
          <Text style={styles.detail}>You need 80% to pass. Review the unit and try again.</Text>
        ) : null}

        {!failed ? (
          <View style={styles.stats}>
            <Stat label="XP earned" value={`+${params.xp ?? 0}`} color={theme.colors.xp} icon="flash" />
            <Stat label="Accuracy" value={`${params.accuracy ?? 0}%`} color={theme.colors.success} icon="checkmark-done" />
            <Stat label="Streak" value={String(displayStreak(state, now))} color={theme.colors.streak} icon="flame" />
          </View>
        ) : null}

        <View style={styles.goal}>
          <Text style={styles.goalLabel}>
            Daily goal · {Math.min(today, goal)}/{goal} XP{today >= goal ? ' ✓' : ''}
          </Text>
          <View style={styles.goalBar}>
            <ProgressBar value={today / goal} color={theme.colors.xp} />
          </View>
        </View>
      </ScrollView>
      <Button testID="done" label="Continue" onPress={() => router.replace('/')} />
    </Screen>
  );
}

function Stat({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View style={[styles.stat, { borderColor: color }]}>
      <Text style={[styles.statLabel, { backgroundColor: color }]}>{label}</Text>
      <View style={styles.statBody}>
        <Ionicons name={icon} size={18} color={color} />
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: theme.spacing(6),
    gap: theme.spacing(4),
  },
  scroll: {
    flex: 1,
  },
  hero: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(5),
  },
  badge: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  detail: {
    color: theme.colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
  stats: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: theme.spacing(3),
  },
  stat: {
    flex: 1,
    borderWidth: 2,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  statLabel: {
    color: '#11141B',
    fontWeight: '800',
    fontSize: 11,
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingVertical: 4,
  },
  statBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: theme.spacing(3),
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  goal: {
    alignSelf: 'stretch',
    gap: theme.spacing(2),
  },
  goalBar: {
    flexDirection: 'row',
  },
  goalLabel: {
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
});
