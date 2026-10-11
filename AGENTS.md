# ShutterTap — Agent Instructions

Read this file first, then the referenced docs. The docs describe the
REAL repository as verified on 2026-10-11 — not the history claimed
in older TODO.md/PROGRESS.md/README.md notes (several of those claims
were invalidated by audit; see PROGRESS.md).

## Project identity

- Root: `/Users/ombadgujar/Development/ShutterTap`
- What it is: Expo SDK 57 + React Native 0.86.3 + React 19.2.3,
  Hermes, New Architecture, Expo prebuild-managed `android/` + `ios/`,
  React Navigation bottom-tabs UI (Home, Device, Gesture, Camera,
  Gallery, Media). No Expo Router. No Expo Go (custom native code
  needs development builds).
- Legacy reference: `/Users/ombadgujar/Development/EarShot`
  (**READ-ONLY** — never modify, rename, delete, move, or reformat
  anything inside it; `ls`/read only).
- No Git operations, ever (owner handles Git/GitHub manually).

## Doc map (read as needed)

- `ARCHITECTURE.md` — verified architecture, version table, bridge
  map, baselines, and the Architecture Decision Record (selected:
  **Option B — Expo development builds**). Read before changing config.
- `PROJECT_RULES.md` — permanent constraints (safety, preservation,
  dependencies, verification honesty, docs policy). Obey always.
- `TESTING.md` — exact commands for Metro, static checks, Android,
  iOS, hardware matrix, performance workflow, troubleshooting.
- `TODO.md` — actionable backlog (P0–P3) with IDs, evidence, files,
  acceptance criteria, test requirements, status. Work from here.
- `PROGRESS.md` — running log (condition, work done, commands +
  results, blockers, next task). Update it every work cycle.
- `TEST_CHECKLIST.md` — manual hardware checklist (for later device runs).
- `PAGE_SIZE_FIX.md` — 16 KB notes; treat as advisory, NOT verified
  procedure (see ST-P2-04).

## Verified versions (do not blindly change)

expo 57.0.24 (target ~57.0.27) · react-native 0.86.3 · react 19.2.3 ·
AGP 8.12.0 · Gradle 9.3.1 · Kotlin ref 2.1.20 · Java 21 · Xcode 27.0 ·
CocoaPods 1.17.0 · Node 26.9.0 · npm 11.19.1 (npm + package-lock only).

## Correct commands (post-fix workflow; see TESTING.md)

- Deps: `npm install`
- Metro (one instance): `npx expo start --dev-client`
- Android dev: `npx expo run:android`
- iOS dev: `bundle exec pod install --project-directory=ios` then
  `npx expo run:ios` (one simulator only)
- Checks: `npx tsc --noEmit` · `npx eslint .` · `npm test` ·
  `npx expo-doctor`
- Logs: `adb logcat` (Android), Console/Xcode (iOS)
- Caches: reset only what's needed; never mass-wipe simulators,
  DerivedData, Pods, or lockfiles as a first response.

## Critical known state (don't assume otherwise)

1. **No custom native modules exist.** `BluetoothModule`,
   `CameraModule`, `MediaButtonModule`, `ShutterTapPackage`,
   `com.shuttertap.*` — all ABSENT. Prior docs claiming migration are
   wrong. JS screens referencing them degrade or throw (see
   ARCHITECTURE.md §3/§7). Porting from EarShot is TODO ST-P0-07.
2. **Entry-name mismatch (P0):** `index.js` registers `"ShutterTap"`,
   natives expect `"main"`. Must fix (ST-P0-01).
3. **Manifest/Info.plist lack permissions** for BT/Camera/Media
   (ST-P0-03). Prior claims otherwise are wrong.
4. **Pods not installed** (`ios/Pods`, `Podfile.lock` absent) — iOS
   cannot build until `pod install` (ST-P0-04).
5. **Metro/Babel/scripts/app.json are half-bare, half-Expo** —
   alignment tasks ST-P1-01/02/04. Never run `expo prebuild --clean`
   without a backup plan.
6. **8 GB M2 is memory-starved at idle** (85M free during audit) —
   follow TESTING.md §6 one-simulator workflow; record measurements.
7. **16 KB page-size**: no verified offending-library list exists yet;
   diagnose from packaged artifacts first (ST-P2-04), no blind flags.

## Before marking work complete

- Run the narrowest relevant test, then broader regression tests.
- Record exact command + exit status + result + limitations.
- Distinguish passed / failed / not run / blocked; distinguish UI vs
  bridge vs emulator vs physical vs hardware-specific verification.
- Update TODO.md + PROGRESS.md; keep diffs small and reversible.
- Confirm: no Git ops performed, EarShot untouched.
