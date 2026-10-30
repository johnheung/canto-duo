# CantoDuo

A mobile app for learning Cantonese a few minutes a day. It's built with Expo (React Native) and runs on iOS and Android. There's no login: progress is saved on the device.

## Features

- **Learning path**: 8 units (Greetings, Numbers, Food & Drink, Family, Time, Getting Around, Shopping, Daily Life). Each has 4 lessons and a checkpoint test. Lessons unlock in order, and passing a checkpoint (80%) opens the next unit. Locked units have a **Jump here?** button that runs the previous checkpoint, so you can test out of material you already know.
- **Exercise types**:

  | Exercise | What you do |
  |---|---|
  | Meaning | Pick the English meaning of a Cantonese word |
  | Say it | Pick the Cantonese for an English word |
  | Listen | Pick the word you hear |
  | Match | Tap Cantonese/English pairs |
  | Tones | Pick the tone (1–6) of a syllable |
  | Build | Make a sentence from a word bank, in either direction |
  | Type | Type the Jyutping, with tone numbers required at higher difficulty |

- **Motivation**: XP, a daily goal, a streak, hearts (optional), lesson levels (each lesson can be levelled up 3 times), and a celebration screen. Wrong answers come back at the end of the lesson.
- **Practice**: a spaced-repetition review (Leitner boxes) of your weakest and overdue words. Each practice session earns a heart.
- **Audio**: the device's Cantonese text-to-speech voice (`zh-HK`). If the device has no Cantonese voice, Settings says so.

## Difficulty

You choose a level when you start, and can change it in **Settings**:

| Level | Starts at | Base difficulty |
|---|---|---|
| Beginner | Unit 1 | 0 |
| Intermediate | Unit 3 | 2 |
| Advanced | Unit 5 | 4 |

Each lesson gets a difficulty score from 0 to 10: `level base + 0.75 × unit + lesson level`. As the score rises (`lib/engine/difficulty.ts`):

- Recognition exercises give way to production: building sentences and typing
- You get more answer options, and the wrong options look more like the right one
- More extra words appear in word banks, and tone questions have more options
- The script moves from Jyutping first, to characters and Jyutping, to characters only (tap a prompt for a hint)
- Typed answers must include tone numbers
- More older words are mixed in for review

## Running it

```bash
npm install
npm run start   # scan the QR code with Expo Go, or press i / a for a simulator
npm run web     # run in the browser
npm test        # engine and progress tests
npm run typecheck
```

## Building and deploying

Deployment works the same way as in the Fitness App: EAS Build, started from GitHub Actions.

1. Add an `EXPO_TOKEN` secret to this repo (Settings → Secrets and variables → Actions).
2. Open **Actions → EAS Build (Android) → Run workflow** and pick a profile:
   - `preview`: an installable APK for internal testing
   - `production`: a store build with automatic version numbers

The profiles are in `eas.json`. The workflow is in `.github/workflows/eas-build.yml`.

## Project structure

```
app/                 Expo Router screens: tabs (Learn, Practice, Profile, Settings), onboarding, lesson runner
components/          UI building blocks and exercises/ (one component per exercise type)
lib/content/         Course data (course.ts) and lookups
lib/engine/          Pure logic: difficulty, lesson generation, grading, spaced repetition, lesson planning
lib/progress.ts      XP, streaks, hearts, unlocking (pure functions)
lib/context/         React context that persists progress with AsyncStorage
__tests__/           Jest tests for the engine and progress rules
```

To add content, add words or sentences in `lib/content/course.ts`. In a sentence, separate the tokens with `|` in both the characters and the Jyutping. Each token's Jyutping needs one syllable per character, and the tests check this.

## Content note

The vocabulary, Jyutping and tones were written carefully, but they **should be reviewed by a native Cantonese speaker** before a public release.
