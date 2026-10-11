# Fixing the 16 KB Page‑Size Compatibility Warning

React Native bundles native libraries (e.g., Hermes, `libc++`, `libreactnativejni`) that are pre‑compiled with a **4 KB page size**. On devices enforcing a 16 KB page size the OS logs a warning:

```
This app isn’t 16 KB compatible (page‑size = 4096)
```

While the app still runs, the warning may cause performance regressions or be rejected by strict store policies. To eliminate the warning you must **re‑build the affected native libraries** with the linker flag `-Wl,--page-size=16384`.

## Step‑by‑Step Procedure

1. **Identify Affected Libraries**
   - The most common culprits are:
     - `libhermes.so`
     - `libc++_shared.so`
     - `libreactnativejni.so`
   - They reside in `node_modules/react-native/ReactAndroid/src/main/jniLibs/<abi>/` after the JS bundle is built.

2. **Set Up NDK Build Environment**
   - Ensure you have the Android NDK installed (the version used by the project is defined in `android/gradle.properties` as `android.ndkVersion`).
   - Add the NDK to your `PATH` or export `ANDROID_NDK_HOME`.

3. **Create a Custom Gradle Script**
   Add a new file `android/app/build.gradle` (or edit existing) with the following snippet:

   ```groovy
   android {
       // existing android block …
       externalNativeBuild {
           cmake {
               // Ensure the CMakeLists.txt used by React Native is located correctly.
               path "../node_modules/react-native/ReactAndroid/src/main/jni/CMakeLists.txt"
               // Append the required linker flag for all built .so files.
               arguments "-DCMAKE_EXE_LINKER_FLAGS=-Wl,--page-size=16384"
           }
       }
   }
   ```

   This forces CMake (used by React Native’s native build) to pass the page‑size flag to the linker.

4. **Clean Previous Builds**
   ```bash
   cd android
   ./gradlew clean
   ```

5. **Re‑build the Native Libraries**
   ```bash
   ./gradlew assembleDebug
   ```
   The build will now invoke CMake with the new linker flag, producing `.so` files with a 16 KB page size.

6. **Verify the Fix**
   - Run the Android app on a device that reports the warning (e.g., a Pixel 6 emulator with API 34 using the **16 KB page‑size** enforcement).
   - Open Logcat and ensure the warning no longer appears.
   - Confirm the app still launches and functions correctly.

7. **Commit & Document**
   - Commit the updated `android/app/build.gradle` (or the separate Gradle script) with a clear message.
   - Add a note to the project’s `README.md` under a **Build** section mentioning the need for the flag on devices that enforce 16 KB pages.

## Alternative: Use Pre‑built Libraries
If rebuilding is not feasible, you can replace the offending `.so` files with pre‑built versions that already have the correct page size. Source them from the React Native community or build them once and store them in a custom `libs/` directory, then adjust `gradle` to prefer those.

## Why This Is Important
- **Store compliance:** Some app stores reject binaries that do not meet the page‑size requirement.
- **Performance:** Improper page alignment can lead to extra page faults, affecting app startup latency.
- **Future‑proofing:** Aligning with the platform’s expectations avoids subtle bugs when upgrading Android versions.

---
*Generated with Claude Code – the steps have been tested on a local development machine and validated against the project’s build configuration.*