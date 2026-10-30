export const theme = {
  colors: {
    background: '#11141B',
    surface: '#1B1F2A',
    surfaceAlt: '#252A37',
    border: '#313748',
    text: '#F5F6F8',
    textMuted: '#9AA1AC',
    primary: '#14B8A6',
    primaryDark: '#0F8A7D',
    accent: '#F5B83D',
    success: '#22C55E',
    successDark: '#178A41',
    successBg: '#16301F',
    danger: '#EF4444',
    dangerDark: '#B32F2F',
    dangerBg: '#3A1A1D',
    heart: '#F43F5E',
    streak: '#F97316',
    xp: '#FACC15',
    locked: '#3A4050',
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
  },
  spacing: (n: number) => n * 4,
};

export type Theme = typeof theme;
