# ShutterTap — Architecture

Verified against the actual repository on 2026-10-11. Do not describe
directories, dependencies, screens, or features that are not verified below.

## 1. Identity

- Project: ShutterTap (student project, migrated from a legacy native
  Android reference app, kept outside this repository).
- Root: the repository root (referred to below as `<repo>`).
- No Git operations are performed in this project (owner handles Git manually).

## 2. Verified versions (installed, from node_modules + tool output)

| Component | Version | Evidence |
|---|---|---|
| expo | 57.0.24 | `node_modules/expo/package.json` |
| react-native | 0.86.3 | `node_modules/react-native/package.json` |
| react | 19.2.3 | `node_modules/react/package.json` |
| expo-modules-autolinking | 57.0.13 | `node_modules/expo-modules-autolinking/package.json` |
| @react-native-community/cli | 20.2.0 | package.json devDeps (installed CLI present via `react-native` bin) |
| Node.js | 26.9.0 | `node --version` |
| npm | 11.19.1 | `npm --version` |
| Java | 21.0.10 LTS | `java -version` |
| Gradle wrapper | 9.3.1 | `android/gradle/wrapper/gradle-wrapper.properties`, `gradlew --version` |
| Android Gradle Plugin | 8.12.0 | `@react-native/gradle-plugin/gradle/libs.versions.toml` |
| Kotlin (gradle plugin ref) | 2.1.20 | same `libs.versions.toml` |
| Xcode | 27.0 (27A266a) | `xcodebuild -version` |
| CocoaPods | 1.17.0 (bundle exec: 1.15.2) | `pod --version`, Gemfile |
| Android SDK levels (Expo defaults) | minSdk 24 · compileSdk 36 · targetSdk 36 · buildTools 36.0.0 · NDK 27.1.12297006 | `assembleDebug` config output 2026-10-11 |
| iOS Pods | 90 pods incl. precompiled Expo/React-Core/hermes | `pod install` 2026-10-11 (120 s) |
| iOS simulators | iOS 27.0: iPhone 17, 17 Pro, 17 Pro Max | `xcrun simctl list devices available` |
| Android emulators | Medium_Phone_API_36.1, Pixel_8 | `emulator -list-avds` (full SDK path) |
| Machine | Apple M2, 8 GB RAM | `sysctl`, `hw.memsize` |

Expo SDK 57 targets React Native 0.86 / React 19.2 (per Expo SDK
reference docs). The installed trio (expo 57.0.24 + RN 0.86.3 +
React 19.2.3) is therefore the **correct, compatible combination**.
Do not downgrade or blindly upgrade it.

## 3. JavaScript / TypeScript layer

- Entry: `index.js` — bare-style
  `AppRegistry.registerComponent("ShutterTap", () => App)`.
  **Known mismatch (P0):** both native entry points expect the
  component name `"main"` (`MainActivity.getMainComponentName`,
  `AppDelegate startReactNative withModuleName: "main"`), while
  `index.js` registers `"ShutterTap"`. The Expo bare-minimum template
  uses `registerRootComponent(App)` from `expo` instead. This mismatch
  is a probable cause of bundle-load / blank-screen failures and must
  be fixed (see TODO ST-P0-01).
- App root: `App.tsx` — `BluetoothProvider` + `NavigationContainer`
  (light/dark theme via `useColorScheme`) + `AppNavigator`.
- Navigation: React Navigation bottom tabs ONLY (`@react-navigation/
  bottom-tabs` + `@react-navigation/native`). No Expo Router anywhere
  (no `app/` directory, no `expo-router` dependency). Screens:
  Home, Device, Gesture, Camera, Gallery, Media — all in
  `src/screens/*.tsx`, wired in `src/navigation/BottomTabs.tsx`.
- State: `src/state/BluetoothContext.tsx` — context over a native
  `BluetoothModule` accessed via `NativeModules` + `NativeEventEmitter`
  (`onDevicesChanged`, `onStateChanged`), with `getInitialState`,
  `startScan`, `stopScan`, `connect`, `refreshState` calls. All calls
  use optional chaining, so a missing module degrades (no crash here).
- Screens that assume native modules exist (P0 crash risk when modules
  are absent — see §6):
  - `CameraScreen.tsx` → `CameraModule` (`bindPreview`, `takePhoto`,
    `toggleFlash`, `switchCamera`, `startVideo`, `stopVideo`,
    `unbindPreview`). Cleanup calls `CameraModule.unbindPreview?.()`
    which throws if `CameraModule` itself is undefined.
  - `GalleryScreen.tsx` → `MediaButtonModule.listMedia?.()` — throws
    if `MediaButtonModule` is undefined (property access on undefined).
  - `GestureScreen.tsx` → `MediaButtonModule.getGestureMappings /
    setGestureMappings` — same undefined-access risk. Uses
    `AsyncStorage`? No — persistence is delegated to the native side
    (unlike the old README claim about async storage; no
    `@react-native-async-storage` import exists in `src/`).
  - `MediaButtonScreen.tsx` → `MediaButtonModule` + `onMediaButton`
    events. Guarded (`mediaEmitter` null check), safe when absent.
  - `HomeScreen` / `DeviceScreen` → consume `BluetoothContext` only.
- Types: `src/types/models.ts` (`BluetoothDevice`, `GestureType`,
  `CameraAction`, `GestureMapping`, `MediaButtonType`,
  `MediaButtonEvent`). Comments reference `com.shuttertap.*` Kotlin
  classes that **do not exist** in this repo.
- Theme: `src/theme.ts` — static palette + light/dark
  `NavigationContainer` themes. `useTheme()` is a plain function, not
  a React hook (misnomer, harmless).
- `src/components/` is **empty** (no files).
- Tests: `__tests__/App.test.tsx` renders `<App />`. Currently FAILS
  (PNG asset transform — see §8).

## 4. Metro / Babel / Expo config

- `babel.config.js`: `module:@react-native/babel-preset`. Expo projects
  normally use `babel-preset-expo`. Currently consistent with a bare
  RN setup, but the native projects are Expo-managed — part of the
  hybrid inconsistency (see ADR).
- `metro.config.js`: `@react-native/metro-config` default merge.
  `npx expo-doctor` flags this: Expo expects `expo/metro-config`
  extensions (`resolver.sourceExts` / `assetExts` mismatch). Fix
  planned (ST-P1-01) — low risk, Expo's config wraps RN's.
- `app.json`: bare-RN style (`name`, `displayName`, `android.package`,
  `ios.bundleIdentifier`). `expo-doctor` reports: `displayName` is not
  a valid Expo field; `android`/`ios` blocks won't sync without a
  prebuild pipeline. Fix planned (ST-P1-02): adopt minimal Expo schema
  (`name`, `slug`, `scheme`, keep `android.package` /
  `ios.bundleIdentifier`) without inventing plugins.
- `package.json` scripts: `"start": "react-native start"` is WRONG for
  this Expo-prebuild project; template uses
  `"start": "expo start --dev-client"`. `"android": "expo run:android"`
  and `"ios": "expo run:ios"` are correct dev-build commands. Also has
  a **duplicate `"jest"` key** in devDependencies (ST-P2-01).
- `android/app/build.gradle`: `entryFile` resolved via
  `expo/scripts/resolveAppEntry`, `bundleCommand = "export:embed"`,
  `cliFile` = `@expo/cli` — i.e. bundling goes through Expo CLI.
- `android/settings.gradle`: `expo-autolinking-settings` plugin,
  `expoAutolinking.useExpoModules()`, `useExpoVersionCatalog()`.
- `ios/Podfile`: `use_expo_modules!`, expo autolinking
  (`expo-modules-autolinking react-native-config`), `use_react_native!`
  with Hermes per `Podfile.properties.json`
  (`expo.jsEngine: hermes`). Deployment target default 16.4 via
  `podfile_properties`.
- Conclusion: the native projects are **Expo-generated (prebuild
  output)**, not hand-maintained bare projects. There is no `eas.json`.

## 5. Android native layer (Expo-generated, NO custom modules)

- Location: `android/` (Gradle 9.3.1, AGP 8.12.0, `newArchEnabled=true`,
  `hermesEnabled=true`, `reactNativeArchitectures=all four ABIs`).
- Package: `com.anonymous.shuttertap`. Only two files exist:
  - `MainApplication.kt` — standard Expo `ExpoReactHostFactory` +
    `PackageList`, no manual package registration.
  - `MainActivity.kt` — standard Expo activity, `getMainComponentName
    = "main"`.
- There is **no** `com.shuttertap.*` tree and **no**
  `BluetoothModule` / `CameraModule` / `MediaButtonModule` /
  `ShutterTapPackage` — contrary to prior TODO.md/PROGRESS.md claims.
  Those claims are invalidated by this audit (files do not exist).
- `AndroidManifest.xml`: Expo default + (since 2026-10-11) EarShot-parity
  permission/feature declarations (BT set, CAMERA, RECORD_AUDIO,
  MEDIA_CONTENT_CONTROL, FOREGROUND_SERVICE*, POST_NOTIFICATIONS,
  camera/BT uses-feature). Service/receiver entries deferred to the
  native port (ST-P0-07) since their classes don't exist yet.
- Consequences: every JS call into `BluetoothModule` / `CameraModule`
  / `MediaButtonModule` resolves to `undefined`. Screens using plain
  optional chaining on methods degrade silently; screens accessing
  properties on the undefined module object throw TypeError (see §3).
  No `RECEIVER_EXPORTED` crash is possible in the current tree (the
  reported `MediaButtonModule.kt` receiver bug cannot reproduce —
  the file doesn't exist). Any re-migration must implement the
  Android 13+ receiver flags correctly from the start.

## 6. iOS native layer (Expo-generated, pods NOT installed)

- `ios/ShutterTap/AppDelegate.swift` — Expo delegate + scene adoption
  (2026-10-12): conforms to `ExpoReactNativeFactoryProvider`, creates
  the RN factory in `didFinishLaunching` (no window there);
  `SceneDelegate: ExpoAppSceneDelegate` (same file) creates the window
  from the connecting scene and starts RN (`"main"`). Required by the
  Xcode 27 / iOS 27 SDK (Apple TN3187); without it the app traps at
  scene creation (see TODO ST-P0-10).
- `ios/ShutterTap/Info.plist`: Expo default + (since 2026-10-11)
  `NSBluetoothAlways/Peripheral`, `NSCamera`, `NSMicrophone`,
  `NSPhotoLibrary(Usage/Add)` descriptions. Single-scene
  `UIApplicationSceneManifest` → `SceneDelegate` (Xcode 27 mandate;
  ST-P0-10). No custom native modules.
- No `Podfile.lock`, no `ios/Pods/` — pods are not installed, so no
  iOS build can succeed until `pod install` runs (ST-P0-04).
- No custom native modules (no Bluetooth/Camera/Media bridges).
  Prior TODO item "Implement iOS native modules (or stubs)" was never
  started; correctly remains future work (ST-P3-01).
- Prior failure evidence (`.expo/xcodebuild.log`, 2026-09-21): Swift
  errors `ExpoReactNativeFactoryDelegate has no member
  'newArchEnabled/createRootView/...'` — an Expo-vs-RN version skew
  inside Pods at that time. Since Pods are now absent, the next
  `pod install` (against current compatible node_modules) is expected
  to resolve it; if the error recurs, it becomes a fresh P0.

## 7. Bridge map (intended, NOT implemented)

| JS caller | Native module | Events | Status |
|---|---|---|---|
| BluetoothContext | BluetoothModule | onDevicesChanged, onStateChanged | MISSING (Android+iOS) |
| CameraScreen | CameraModule (view + methods) | none (promises) | MISSING |
| GalleryScreen | MediaButtonModule.listMedia | none | MISSING (+ crash risk) |
| GestureScreen | MediaButtonModule mappings | none | MISSING (+ crash risk) |
| MediaButtonScreen | MediaButtonModule | onMediaButton | MISSING (degrades safely) |

EarShot (`com.earshot`: `bluetooth/`, `camera/`, `service/`,
`repository/`, `model/`, `viewmodel/`) is the reference for
re-implementation. It is read-only; port files into ShutterTap under
`com.anonymous.shuttertap.*` (matching `namespace`/`applicationId`),
never by editing EarShot.

## 8. Validation baseline (2026-10-11, commands run)

- `npx tsc --noEmit` → PASS (exit 0, no output).
- `npx eslint .` → PASS (exit 0, no output).
- `npm test` (jest) → FAIL: `BottomTabs → @react-navigation/bottom-tabs
  → @react-navigation/elements → back-icon.png: SyntaxError: Invalid
  or unexpected token`. Jest has no asset transform for PNGs
  (ST-P1-03). `jest.config.js` is bare (`preset:
  '@react-native/jest-preset'`) with no `moduleNameMapper`/
  `transformIgnorePatterns` handling.
- `npx expo-doctor` → 16/21 pass, 5 fail: (1) `.expo/` not gitignored;
  (2) `app.json` schema (`displayName`); (3) Metro config extensions;
  (4) app-config fields unsynced in non-CNG project; (5) `expo
  57.0.24` vs expected `~57.0.27` patch. None blocks local builds;
  fixes planned (ST-P1-01/02/04, ST-P2-02).
- Android `assembleDebug`: SUCCESS 2026-10-11 (12m37s, 363 tasks;
  requires `ANDROID_HOME=~/Library/Android/sdk` in env — the shell
  default lacks it). Install/launch BLOCKED: both AVDs reference
  system images that are not installed (`system-images/` absent from
  the SDK; emulator exits FATAL). Downloading images is a multi-GB
  owner decision (8.4 GB disk free), recorded in TODO ST-P0-09.
- iOS: `pod install` SUCCESS 2026-10-11 (90 pods, precompiled
  Expo/RN/hermes); Debug build for iPhone 17 simulator SUCCEEDED
  (0 errors, 0 warnings — Sep-2026 Swift skew resolved by fresh pods).
  App INSTALLED (icon verified by screenshot). Launch BLOCKED by
  simulator IPC collapse under memory pressure (`simctl launch`/
  `listapps` stall >5 min; Metro never got a bundle request).
- Devices: no physical devices attached (`adb devices` empty).

## 9. Performance baseline (2026-10-11)

- Machine: M2 Air, 8 GB. At idle audit time (no simulator, no
  emulator, no Metro): `PhysMem: 7534M used, 85M unused`, heavy
  compressor + ~2M swapouts, load ~5. The machine is already under
  severe memory pressure BEFORE launching Xcode/Simulator — this
  alone explains 3–4 min simulator boots and 20–30 s UI lags.
- No duplicate Metro/Node processes observed during audit. No app
  profiling possible yet (app not built/launched). Full simulator
  comparison (idle vs simulator-only vs app-launch) scheduled as
  ST-P2-05 with a one-simulator-only, background-apps-closed workflow.

## 10. Architecture Decision Record

- **Current architecture:** Expo prebuild-managed project (Expo SDK
  57 + RN 0.86.3 + Hermes + New Architecture) with React Navigation
  JS-only UI and zero custom native modules. Metro/Babel/scripts/
  app.json are inconsistently half-bare, half-Expo.
- **Selected: Option B — Expo development builds with Expo tooling,
  Metro, and custom native modules (re-added by porting EarShot).**
- **Alternatives considered:**
  - *Option A (Community CLI + hand-maintained natives):* would
    require ejecting Expo autolinking from both native projects,
    rewriting `settings.gradle`, `Podfile`, `AppDelegate`,
    `MainApplication`, and bundling — a large, irreversible migration
    that destroys working Expo integration for no functional gain.
    Rejected.
  - *Option C (keep hybrid as-is):* the "hybrid" is not intentional —
    it is Expo output with leftover bare-style JS config (`index.js`
    registration, `start` script, Metro/Babel). Keeping it means
    keeping known P0 bugs. Rejected as a steady state; accepted only
    as the starting point for converging on Option B.
- **Evidence:** `settings.gradle` (expo-autolinking-settings),
  `android/build.gradle` (`expo-root-project`), `app/build.gradle`
  (Expo entry resolution + `export:embed`), `Podfile`
  (`use_expo_modules!`), `AppDelegate` (Expo factory), `gradle.properties`
  (`expo.*` flags), installed `expo` + `expo-modules-autolinking`,
  Expo SDK 57 ↔ RN 0.86 compatibility per Expo docs.
- **Advantages:** preserves both native projects; keeps OTA/dev-client
  path open; supports custom native code via dev builds (no Expo Go —
  correctly excluded); minimal migration (config alignment + port
  modules, no rewrite).
- **Trade-offs:** must keep Expo + RN versions in lockstep; must not
  run `expo prebuild --clean` without backing up native customizations
  once ports land; Metro must go through Expo config.
- **Required configuration changes (all small, reversible):**
  1. `index.js` → Expo registration (`registerRootComponent` or
     register `"main"`); 2. `metro.config.js` → `expo/metro-config`;
  3. `package.json` `start` → `expo start --dev-client`, remove
     duplicate `jest`; 4. `app.json` → valid Expo schema;
  5. `.gitignore` += `.expo/`; 6. `jest.config.js` → asset handling;
  7. `expo` patch 57.0.24 → ~57.0.27 via `npx expo install --check`.
  Then: `pod install`, Android debug build, simulator build.
- **Developer workflow (after fixes):** `npm install` (npm + lockfile
  only) → `npx expo start --dev-client` (one Metro) →
  `npx expo run:android` / `npx expo run:ios` (dev builds) →
  `npx tsc --noEmit`, `npx eslint .`, `npm test` → release via
  `export:embed` packaging (no uploads without authorization).
- **Risks / rollback:** each config change is a one-file edit,
  revertible without Git (manual backup note in PROGRESS.md). The
  `expo` patch bump touches `package.json`+lockfile — reviewable via
  diff before/after. Native porting (ST-P0-07) is the only large work;
  it lands as new files under `com.anonymous.shuttertap.*` + manifest
  additions, never edits to EarShot, never `--clean` prebuild.
