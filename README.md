# ShutterTap

ShutterTap is a React Native application (Expo SDK 57 + React Native
0.86.3 + React 19.2.3, Hermes, New Architecture) for triggering a phone
camera via Bluetooth earbud gestures. It uses React Navigation
bottom-tabs (Home, Device, Gesture, Camera, Gallery, Media) and
Expo prebuild-managed native Android/iOS projects with development
builds. There is no Expo Router, and Expo Go is not supported (the app
needs custom native code — see Current status).

> Fresh-clone setup is below. In-depth docs live in the repo:
> `ARCHITECTURE.md` (verified architecture + decision record),
> `TESTING.md` (repeatable test instructions), `TODO.md` (backlog),
> `PROGRESS.md` (work log), `PROJECT_RULES.md` (constraints),
> `AGENTS.md` (agent entry point), `TEST_CHECKLIST.md` (hardware tests).

## Prerequisites

- Node.js (repo uses npm + `package-lock.json` only — do not mix
  Yarn/pnpm) with dependencies installed via `npm install`.
- Android: JDK 21, Android SDK with `ANDROID_HOME` set, Gradle wrapper
  (`android/gradlew` — no global install needed).
- iOS (macOS only): Xcode 27, CocoaPods via Bundler (`bundle install`
  once), one simulator at a time (the dev machine profile is an 8 GB
  Mac — see `TESTING.md` §6).
- No physical device is required to build; Bluetooth/camera/media
  features require real hardware (see Current status).

## Setup from a fresh clone

```sh
npm install
bundle install              # installs CocoaPods itself (macOS, first time only)
bundle exec pod install --project-directory=ios
```

Start the JavaScript bundler (exactly one instance):

```sh
npx expo start --dev-client
```

Build and run a development build (each in its own terminal alongside
Metro):

```sh
npx expo run:android         # needs ANDROID_HOME set, e.g. ~/Library/Android/sdk
npx expo run:ios -d "iPhone 17"
```

Static checks and tests:

```sh
npx tsc --noEmit
npx eslint .
npm test
npx expo-doctor
```

## Current status (honest, verified 2026-10-12)

- iOS simulator Debug build launches and renders (scene-lifecycle
  adoption for the Xcode 27 SDK is in place); Android Debug
  `assembleDebug` succeeds.
- The Bluetooth / Camera / MediaButton **native modules are not yet
  ported** from the legacy reference app, so those screens show
  explicit "unavailable" states. Native feature work is tracked in
  `TODO.md` (ST-P0-07) with `TEST_CHECKLIST.md` for device runs.
- Android emulator images are not bundled with this repo; physical
  hardware is required for Bluetooth/camera/media verification.
- Do not run `expo prebuild --clean` without a backup: `android/` and
  `ios/` contain the maintained native projects.

## Project layout

- `App.tsx`, `index.js` — JS entry (`registerRootComponent`, `"main"`).
- `src/` — screens, navigation, state (`BluetoothContext`), types, theme.
- `android/` — Expo-managed native project (`com.anonymous.shuttertap`).
- `ios/` — Expo-managed native project + `SceneDelegate` (see `ARCHITECTURE.md`).
- `__tests__/` — Jest tests.
- `*.md` (root) — documentation listed above.
