import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Speech from 'expo-speech';
import { clearAllMockStorages } from '@react-native-async-storage/async-storage/jest';
import { VoiceTip } from '@/components/VoiceTip';
import { ProgressProvider } from '@/lib/context/ProgressContext';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest'),
);

const voices: { language: string; identifier: string }[] = [];
jest.mock('expo-speech', () => ({
  getAvailableVoicesAsync: jest.fn(async () => voices),
  speak: jest.fn(),
  stop: jest.fn(),
}));

async function renderTip() {
  const utils = render(
    <ProgressProvider>
      <VoiceTip />
    </ProgressProvider>,
  );
  await waitFor(() => expect(Speech.getAvailableVoicesAsync).toHaveBeenCalled());
  await act(async () => {});
  return utils;
}

beforeEach(() => {
  clearAllMockStorages();
  jest.mocked(Speech.getAvailableVoicesAsync).mockClear();
});

// Order matters: a found voice is cached for the rest of the run.
describe('VoiceTip', () => {
  it('shows Android install steps when there is no Cantonese voice, and stays dismissed', async () => {
    voices.splice(0, voices.length, { language: 'en-US', identifier: 'en' });
    const first = await renderTip();
    expect(screen.getByTestId('voice-tip')).toBeTruthy();
    expect(screen.getByText(/Speech Services by Google/)).toBeTruthy();
    fireEvent.press(screen.getByTestId('voice-tip-dismiss'));
    expect(screen.queryByTestId('voice-tip')).toBeNull();
    await act(async () => {}); // let the dismissal save
    first.unmount();

    // A fresh app start loads the dismissal from storage.
    await renderTip();
    expect(screen.queryByTestId('voice-tip')).toBeNull();
  });

  it('retries while Android speech is starting, then finds yue-HK and stays hidden', async () => {
    voices.splice(0, voices.length, { language: 'yue-HK', identifier: 'yue-hk-x-jar-local' });
    // First call: engine not ready yet, no voices.
    jest.mocked(Speech.getAvailableVoicesAsync).mockResolvedValueOnce([]);
    await renderTip();
    await waitFor(() => expect(Speech.getAvailableVoicesAsync).toHaveBeenCalledTimes(2), { timeout: 3000 });
    await act(async () => {});
    expect(screen.queryByTestId('voice-tip')).toBeNull();
  });
});
