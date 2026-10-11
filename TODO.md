# ShutterTap — Engineering Backlog

Authoritative backlog as of 2026-10-11 audit. Statuses:
`[ ]` not started · `[~]` in progress · `[x]` verified complete ·
`[BLOCKED]` cannot proceed (documented blocker).

> Note on prior backlog (pre-2026-10-11): the old TODO.md claimed the
> Bluetooth/CameraX/MediaButton Kotlin migration, bridge modules,
> manifest permissions, `ShutterTapPackage`, successful Android/iOS
> builds, and iOS Info.plist keys were complete. The 2026-10-11 audit
> verified that **none of those files/keys exist** in the current tree
> (no `com.shuttertap.*`, manifest is Expo-default, no Pods, Info.plist
> has no usage descriptions). Those old checkmarks are invalidated and
> are NOT carried forward as done. Genuinely surviving artifacts:
> `TEST_CHECKLIST.md` (still valid for later hardware runs) and the
> EarShot reference itself. The re-migration is tracked below as
> ST-P0-07.

## P0 — App cannot build, launch, or execute core functionality

- [ ] **ST-P0-01** — Fix JS entry-component name mismatch.
  Evidence: `index.js` registers `"ShutterTap"`; `MainActivity`
  returns `"main"`; `AppDelegate` starts `"main"`.
  Files: `index.js` (fix: Expo `registerRootComponent(App)` or
  register `"main"`).
  Acceptance: dev + release apps load JS without "No component found
  for view" / blank-screen errors.
  Test: Android dev launch + iOS simulator launch, first screen renders.
  Status: `[x]` — fixed 2026-10-11 (`registerRootComponent(App)`).

- [ ] **ST-P0-02** — Guard JS against absent native modules.
  Evidence: `GalleryScreen` (`MediaButtonModule.listMedia?.()`),
  `GestureScreen` (same object), `CameraScreen` cleanup
  (`CameraModule.unbindPreview?.()`) throw TypeError when the module
  object itself is `undefined` (property access on undefined).
  Files: `src/screens/GalleryScreen.tsx`, `GestureScreen.tsx`,
  `CameraScreen.tsx`.
  Acceptance: with no native modules installed, every tab renders an
  explicit empty/error state instead of throwing.
  Test: `npm test` (after ST-P1-03) + manual tab walk on dev build.
  Status: `[x]` — guarded 2026-10-11 (explicit unavailable states).

- [ ] **ST-P0-03** — Add Android + iOS permissions and declarations.
  Evidence: `AndroidManifest.xml` has no BT/Camera/Media permissions,
  receivers, or services; `Info.plist` has no `NSBluetooth*` /
  `NSCameraUsageDescription` / `NSMicrophone*` / `NSPhotoLibrary*`.
  Files: `android/app/src/main/AndroidManifest.xml`,
  `ios/ShutterTap/Info.plist` (via config plugin or direct edit —
  decide in implementation, record reason; never `--clean` prebuild
  without backup).
  Acceptance: manifests declare everything EarShot declares that
  ShutterTap needs (compare with EarShot manifest during
  implementation); `expo-doctor`/builds pass.
  Test: builds on both platforms; permission prompts verified on
  hardware later.
  Status: `[~]` — declarations added 2026-10-11 (full EarShot parity
  minus service/receiver, which land with ST-P0-07); runtime
  verification pending (Android blocked, iOS install in progress).

- [ ] **ST-P0-04** — Install Pods and build iOS for simulator.
  Evidence: `ios/Pods/` and `Podfile.lock` absent; Sep-2026
  `.expo/xcodebuild.log` showed stale-Pods Swift skew
  (`ExpoReactNativeFactoryDelegate has no member ...`).
  Files: `ios/Podfile`, `Podfile.properties.json`.
  Acceptance: `bundle exec pod install --project-directory=ios`
  succeeds; `npx expo run:ios` compiles for one simulator.
  Test: simulator build log inspected, FIRST error recorded if any.
  Depends: ST-P0-01 (entry) for runtime; build alone does not need it.
  Status: `[x]` — `pod install` OK 2026-10-11 (90 pods, precompiled);
  Debug build for iPhone 17 simulator SUCCEEDED (0 errors, 0 warnings).

- [ ] **ST-P0-05** — Android debug build, install, launch, logcat.
  Evidence: no trusted build result exists for current tree.
  Files: `android/` (no changes expected unless build log proves need).
  Acceptance: `assembleDebug` succeeds; app installs, launches, loads
  bundle, renders first screen, navigates; logcat inspected, no
  uncaught native exceptions.
  Test: `cd android && ./gradlew assembleDebug`, `npx expo run:android`
  on one AVD (`Medium_Phone_API_36.1` or `Pixel_8`), `adb logcat`.
  Status: `[~]` — `assembleDebug` SUCCEEDED 2026-10-11 (12m37s, 363
  tasks; required `ANDROID_HOME=~/Library/Android/sdk` in env).
  Install/launch BLOCKED: both AVDs reference system images that are
  not installed (`system-images/` absent); see ST-P0-09 note below.

- [ ] **ST-P0-06** — iOS simulator launch + navigation verification.
  Evidence: same as ST-P0-04 (no trusted runtime result).
  Acceptance: app installs, launches, renders, navigates with no
  immediate crash; Console logs inspected.
  Test: `npx expo run:ios -d "iPhone 17"` (`-d/--device`; note:
  `--simulator` is NOT a valid flag in this CLI), single simulator.
  Depends: ST-P0-04. Status: `[x]` — 2026-10-12: launch + first-screen
  render + tab-bar render PASS (screenshot-verified Home screen,
  "Bluetooth status: None", 6 tabs); 5+ min stability PASS (no new
  crash reports); device-log error scan clean. Tab-tap navigation
  NOT RUN (no tap API under stalled simctl; needs interactive pass).
  Unblocked by ST-P0-10 scene fix.

- [ ] **ST-P0-07** — Port native modules from EarShot (BT, Camera,
  MediaButton + package registration + manifest/service entries).
  Evidence: JS expects `BluetoothModule` (events `onDevicesChanged`,
  `onStateChanged`; methods `getInitialState/startScan/stopScan/
  connect/refreshState`), `CameraModule` (view + `bindPreview/
  takePhoto/toggleFlash/switchCamera/startVideo/stopVideo/
  unbindPreview`), `MediaButtonModule` (`listMedia`,
  `getGestureMappings/setGestureMappings`, event `onMediaButton`).
  None exist. Reference: EarShot `bluetooth/`, `camera/`, `service/`,
  `repository/`, `model/` (READ-ONLY — port, never move).
  Files (new, under `com.anonymous.shuttertap.*` to match
  namespace/applicationId): packages, modules, receivers/services,
  manifest entries (with Android 13+ `RECEIVER_EXPORTED`/
  `RECEIVER_NOT_EXPORTED` flags done right — the historic crash class).
  Acceptance: each JS caller resolves a real module; tab walkthrough
  exercises methods without TypeErrors; logcat shows correct
  registration, no export-flag crash.
  Test: ST-P0-05 device run + targeted method/event checks; hardware
  behaviors remain BLOCKED (see ST-P0-09).
  Depends: ST-P0-03, ST-P0-05. This is the only large task; land as
  small reviewable file groups. Status: `[ ]`.

- [ ] **ST-P0-08** — Validate release packaging (Android + iOS).
  Evidence: debug success says nothing about release; `app/build.gradle`
  uses Expo `export:embed`, iOS release uses `main.jsbundle`.
  Acceptance: release bundles embed JS+assets; release app starts with
  no Metro running; no dev-only dependency at runtime.
  Test: release build + offline-start check on each platform.
  Depends: ST-P0-05, ST-P0-06. Status: `[ ]`.

- [x] **ST-P0-10** — Adopt iOS scene lifecycle (startup SIGTRAP fix).
  Evidence: `EXC_BREAKPOINT` in
  `___UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption_block_invoke`;
  device log: "Application failed to launch: UIScene life cycle is
  required for apps built with this SDK" (Apple TN3187; Xcode 27 /
  iOS 27 SDK mandate). Crash occurred before `didFinishLaunching` —
  JS/Metro never involved.
  Fix (uses `ExpoAppSceneDelegate` shipped in installed expo 57.0.27 —
  no dependency change): `AppDelegate` conforms to
  `ExpoReactNativeFactoryProvider`, window creation moved out of
  `didFinishLaunching` into new `SceneDelegate: ExpoAppSceneDelegate`
  (same file, no pbxproj change), single-scene
  `UIApplicationSceneManifest` in `Info.plist` (no storyboard —
  programmatic window per TN3187).
  Files: `ios/ShutterTap/AppDelegate.swift`, `ios/ShutterTap/Info.plist`.
  Test: rebuild 0 err/0 warn; Metro served `index.js` (937 modules);
  render + stability verified (see ST-P0-06). Status: `[x]` — 2026-10-12.

- [BLOCKED] **ST-P0-09** — Hardware verification (BT radio, camera,
  media buttons, MediaStore).
  Blockers: (a) no physical devices attached (`adb devices` empty);
  features require real hardware; (b) Android emulator unusable — both
  AVDs (`Pixel_8` → android-35, `Medium_Phone` → android-36.1) reference
  system images under `~/Library/Android/sdk/system-images/`, which
  does not exist (verified 2026-10-11; emulator exits FATAL). Remedy
  needs owner decision: download via
  `~/Library/Android/sdk/cmdline-tools/latest/bin/sdkmanager
  "system-images;android-<level>;google_apis_playstore;arm64-v8a"`
  (multi-GB, only 8.4 GB disk free on 2026-10-11) then cold-boot one
  AVD — expensive on this 8 GB machine, so recorded not executed.
  Use `TEST_CHECKLIST.md` when hardware is available. Distinguish
  UI / bridge / emulator / physical / hardware-specific results.
  Status: `[BLOCKED]`.

## P1 — Major stability / compatibility / performance

- [ ] **ST-P1-01** — `metro.config.js` → `expo/metro-config`.
  Evidence: `expo-doctor` flags `resolver.sourceExts`/`assetExts`.
  Acceptance: doctor Metro check passes; dev bundling works both platforms.
  Test: doctor + dev launches. Status: `[x]` — 2026-10-11
  (`expo/metro-config`, no new dep; doctor Metro check passes).

- [ ] **ST-P1-02** — `package.json` start script + `app.json` Expo schema.
  Evidence: `start` is `react-native start` (template: `expo start
  --dev-client`); `app.json` has invalid `displayName` + unsynced
  android/ios blocks per doctor.
  Files: `package.json` (`start`), `app.json` (minimal valid Expo
  fields: `name/slug/scheme`, keep package/bundleIdentifier).
  Acceptance: both doctor config checks pass; docs match scripts.
  Test: doctor + Metro start. Status: `[x]` — 2026-10-11 (`expo start
  --dev-client`, `"main": "index.js"`, Expo-schema `app.json`).

- [ ] **ST-P1-03** — Fix jest PNG asset transform.
  Evidence: `npm test` FAILS (`back-icon.png: SyntaxError`) — no asset
  mapping in `jest.config.js`.
  Acceptance: `npm test` runs the suite (pass or genuine assertion
  result, not a parse error).
  Test: `npm test`. Status: `[x]` — 2026-10-11 (allow-listed
  `@react-navigation` in `transformIgnorePatterns`; suite passes).

- [ ] **ST-P1-04** — `.gitignore` += `.expo/`.
  Evidence: doctor flags `.expo` not ignored.
  Acceptance: doctor gitignore check passes.
  Test: doctor. Status: `[x]` — 2026-10-11.

- [ ] **ST-P1-05** — JS correctness pass (post-guard).
  Evidence (audit observations): `BottomTabs` calls `useTheme()` inside
  `screenOptions` (works but misstructured — `useTheme` isn't a real
  hook); `CameraScreen` uses deprecated `findNodeHandle`; `GalleryScreen`
  destructures `MediaButtonModule` inside component body per render.
  Acceptance: no hook-rule violations, no deprecated APIs without
  reason, no per-render native lookups; behavior unchanged.
  Test: `tsc`, `eslint`, `npm test`, tab walk. Status: `[ ]`.

- [ ] **ST-P1-06** — `expo` patch 57.0.24 → ~57.0.27.
  Evidence: doctor "1 package out of date".
  Action: `npx expo install --check` (scoped to expo patch only),
  review `package.json`+lockfile diff.
  Acceptance: doctor version check passes; builds unaffected.
  Test: doctor + one platform dev launch. Status: `[x]` — 2026-10-11
  (expo 57.0.24 → 57.0.27 via `npx expo install`; tsc/eslint/jest
  re-verified green).

## P2 — Secondary bugs, tests, maintainability

- [ ] **ST-P2-01** — Remove duplicate `"jest"` key in `package.json`
  devDependencies (currently listed twice).
  Test: `npm install --dry-run` or parse check + `npm test`. Status: `[x]` — 2026-10-11.

- [~] **ST-P2-02** — Re-run `expo-doctor` to 21/21 after P1 fixes.
  Record residual warnings with reasons. Status: `[~]` — 20/21 on
  2026-10-11; residual is the informational non-CNG notice (accepted:
  native folders are intentionally committed, values match).

- [ ] **ST-P2-03** — Rewrite `README.md` to match reality.
  Evidence: current README claims plain-RN + existing native modules +
  present Info.plist keys — all false. Replace with Expo-dev-build
  workflow + pointer to ARCHITECTURE/TESTING. Status: `[x]` — 2026-10-12
  (rewritten during publication prep: fresh-clone setup, verified
  commands, honest limitations).

- [ ] **ST-P2-04** — 16 KB page-size: diagnose from packaged artifacts.
  Evidence: no verified offending-library list exists; `PAGE_SIZE_FIX.md`
  is advisory (tells a CMake rebuild story without artifact proof).
  Action: inspect APK/AAB `.so` ELF LOAD alignment first (the debug APK
  at `android/app/build/outputs/apk/debug/app-debug.apk` exists since
  2026-10-11); only then decide upgrades/rebuilds. Never blindly add
  `-Wl,--page-size=16384` to an arbitrary target.
  Test: alignment report from actual artifacts. Status: `[ ]`.

- [~] **ST-P2-05** — Simulator performance: measure idle / simulator /
  app-launch states; enforce one-simulator workflow.
  Datapoints 2026-10-11: idle 85 MB free; sim+Metro ~63 MB free;
  `simctl listapps`/`launch` stall >5 min; `simctl io screenshot`
  works (~60–90 s); sim clock advances (alive, launchd IPC glacial);
  VS Code + ChatGPT + Gradle daemons added pressure (idle Gradle
  daemons stopped to help). Cause identified: memory starvation on
  8 GB M2, not app code (app never reached JS load). Workflow in
  TESTING.md §6. Depends: ST-P0-06 for the app-launch datapoint.
  Status: `[~]`.

- [ ] **ST-P2-06** — Release-packaging pre-checks per platform.
  Covers ST-P0-08 groundwork: confirm `export:embed` (Android) and
  `main.jsbundle` (iOS) outputs exist from the verified builds; no
  dev-server dependency at startup. Status: `[ ]`.

## P3 — Optional improvements

- [ ] **ST-P3-01** — iOS native modules (Bluetooth/Camera/Media) or
  documented stubs. Never started; correctly future work. No JS changes
  needed first (screens already degrade explicitly). Status: `[ ]`.

- [ ] **ST-P3-02** — Evaluate EAS / OTA update config (optional).
  No `eas.json` exists; only pursue if owner wants Expo services.
  Status: `[ ]`.

- [ ] **ST-P3-03** — UI polish (theme consistency, accessibility
  labels, list optimizations). Only after functionality is verified;
  never as part of stabilization. Status: `[ ]`.