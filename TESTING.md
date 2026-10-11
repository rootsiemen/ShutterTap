# ShutterTap — Testing

Repeatable instructions. Record exact command, exit status, result,
and limitations every time (see PROGRESS.md).

## 0. One-time environment

- npm only (lockfile: `package-lock.json`). Install: `npm install`.
- Do NOT use Expo Go (custom native code needs a development build).
- Run exactly ONE Metro instance per session (see §1).
- iOS first-time (and after native-dep changes):
  `bundle install` (once for CocoaPods itself), then
  `bundle exec pod install --project-directory=ios`.
  Do NOT delete `Podfile.lock` or run prebuild to fix build errors.
- Android SDK paths used here:
  `~/Library/Android/sdk/emulator/emulator -list-avds`,
  `~/Library/Android/sdk/platform-tools/adb`.
- Available targets (verified 2026-10-11): iOS simulators (iOS 27.0:
  iPhone 17 / 17 Pro / 17 Pro Max); Android AVDs
  (`Medium_Phone_API_36.1`, `Pixel_8`). No physical devices attached.

## 1. Metro / dev server (one terminal)

Correct command (after ST-P1-02 lands; until then `npm start` still
resolves to bare `react-native start` and may misbehave with the Expo
virtual entry):

```sh
npx expo start --dev-client
```

- Keep this terminal dedicated to Metro. Stop with Ctrl+C.
- If the bundler port is busy, find the stray process (`lsof -i :8081`)
  and stop it — never run two Metros to "fix" a bundle-load error.
- Bundle-load failure triage: (a) note build type (debug dev-build vs
  release); (b) confirm Metro is running AND the installed app is a
  dev build pointing at this Metro; (c) for USB Android, check whether
  `adb reverse tcp:8081 tcp:8081` is needed for the current setup;
  (d) for release, verify `main.jsbundle` + assets are packaged
  (`export:embed`), not Metro reachability.

## 2. Static checks (fast, run first)

```sh
npx tsc --noEmit     # expected: PASS (exit 0)
npx eslint .         # expected: PASS (exit 0)
npm test             # currently FAILS (PNG asset transform, ST-P1-03)
npx expo-doctor      # currently 16/21 pass, 5 known fails (see ARCHITECTURE.md §8)
```

## 3. Android

```sh
cd android && ./gradlew clean && ./gradlew assembleDebug
```

- Install/launch (one device at a time):
  ```sh
  npx expo run:android          # dev build (after config fixes)
  # or: npx expo run:android --device <avd-name>
  ```
- Runtime success criteria: installs, launches, correct bundle loads,
  first screen renders, no immediate native crash, navigation works,
  `adb logcat` shows no relevant exceptions (filter by
  `com.anonymous.shuttertap` + `ReactNativeJS`).
- Release packaging (separate from debug): verify bundle+assets are
  embedded via `export:embed`; never confuse a working debug app with
  a verified release app.
- Known current state: no custom native modules exist, so BT/Camera/
  Media/Gallery screens degrade or throw TypeErrors (ST-P0-02/07).
  The historic `RECEIVER_EXPORTED` crash cannot reproduce (file absent).

## 4. iOS

```sh
bundle exec pod install --project-directory=ios
npx expo run:ios                # dev build to one simulator
# pick ONE simulator, e.g.:
# npx expo run:ios --simulator "iPhone 17"
```

- Launch only ONE simulator at a time (8 GB machine). Keep other apps
  closed (see §6).
- Runtime success criteria: builds, installs, launches, first screen
  renders, no immediate crash, navigation works, Console shows no
  native exceptions.
- Permission keys (`NSBluetooth*`, `NSCameraUsageDescription`,
  `NSMicrophone*`, `NSPhotoLibrary*`) are MISSING from `Info.plist`
  (ST-P0-03) — add before hardware testing.
- `rsync / sandbox` guidance: on the next build failure, capture the
  FIRST meaningful error (not the final generic failure); do not
  disable script sandboxing or hand-edit DerivedData. Prior Sep-2026
  Swift errors (`ExpoReactNativeFactoryDelegate` members) were from a
  stale-Pods state; re-evaluate after fresh `pod install`.
- Release: verify `main.jsbundle` generation separately.

## 5. Hardware-dependent matrix (all BLOCKED without devices)

| Feature | Emulator OK | Physical required | Current state |
|---|---|---|---|
| BT discovery/connect/auto-connect | no | yes (BT radio + peripheral) | native MISSING |
| Camera preview/capture/flash/switch/video | partial (simulated) | yes (camera) | native MISSING |
| Media-button events/gestures | no | yes (BT earbuds/buttons) | native MISSING |
| Gallery MediaStore | partial | yes (real media) | native MISSING |
| Settings/gesture persistence | yes (if native lands) | — | native MISSING |

Manual checklist: `TEST_CHECKLIST.md` (still valid for later use).
Never claim these verified from emulator/simulator-only runs.

## 6. Performance workflow (8 GB M2 — constrained)

- Baseline (2026-10-11, idle): 7534M used / 85M free, heavy swap —
  close browsers/background apps before simulator work.
- Compare in order, one step at a time: (A) idle macOS, (B) simulator
  booted without app, (C) app launching, (D) first screen settled.
  Record `vm_stat`, Activity Monitor memory pressure/swap, CPU.
- Rules: one simulator OR one emulator (never both, never two
  simulators); no repeated full rebuilds when a targeted check
  suffices; no wiping all simulator data/DerivedData/caches as a
  first response.
- Suspects to separate (not assume): macOS pressure, Xcode compile
  load, simulator runtime, duplicate Metro/Node, rebuild churn,
  main-thread native init, JS render loops, debugger overhead, stale
  runtimes. See TODO ST-P2-05.

## 7. Troubleshooting quick table

| Symptom | Check first |
|---|---|
| Unable to load script / bundle | build type vs Metro (§1); `index.js` `"main"` registration (ST-P0-01) |
| App white/blank after launch | component-name mismatch; JS exception in Console/logcat |
| `NativeModules.X` undefined | expected until ST-P0-07 lands; check screen guards (ST-P0-02) |
| iOS Swift `has no member` errors | stale Pods vs node_modules; fresh `pod install`, then report FIRST error |
| jest PNG SyntaxError | known ST-P1-03, not app code |
| Simulator unusably slow | §6 workflow; record measurements, don't pile on simulators |
