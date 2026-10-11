# Manual Test Checklist for ShutterTap (Hardware‑Dependent Features)

This checklist is intended for developers to run on a **physical Android device** (or a simulator with hardware support) to verify the functionality that cannot be automatically validated in the CI environment.

## 1. Bluetooth Functionality
- [ ] Open the app and ensure only the **Connect** button is visible on the Home screen.
- [ ] Tap **Connect** to start scanning. Verify that the device list updates and displays nearby Bluetooth devices.
- [ ] Select a device from the list. Confirm that the UI shows **Connecting...** and then **Connected** without errors.
- [ ] Verify auto‑connect behavior: disconnect the device (e.g., turn off Bluetooth on the peripheral) and ensure the app re‑connects automatically when the device becomes available again.
- [ ] Confirm that the Bluetooth state (scanning, connecting, connected) is correctly reflected across **Home** and **Device** screens.

## 2. CameraX Integration
- [ ] Navigate to the **Camera** screen.
- [ ] Verify the live preview appears correctly.
- [ ] Capture a photo using the **Photo** button. Confirm that a toast/message shows the saved URI and that the photo appears in the **Gallery** screen.
- [ ] Toggle flash using the **Flash** button and verify the flash state changes (on/off indicator).
- [ ] Switch between front and rear cameras using the **Switch** button and ensure the preview updates.
- [ ] Start video recording using the **Start Video** button, stop it, and verify the video file is saved and listed in the **Gallery**.

## 3. Media Button Events
- [ ] With the app in the foreground, press hardware media buttons on the device (Play/Pause, Next, Previous).
- [ ] Verify that the events appear in the **Media Button** screen with correct timestamps and event types.

## 4. Gesture → Camera Action Mapping
- [ ] Open the **Gesture** screen.
- [ ] Verify that each listed gesture shows its mapped camera action.
- [ ] Tap a gesture row to cycle its action. Confirm the change persists after leaving and re‑opening the screen (native async storage).
- [ ] Perform the gesture on the device (if a hardware gesture is supported) and verify the mapped camera action triggers (e.g., a swipe triggers photo capture).

## 5. Gallery Display
- [ ] After capturing photos/videos, open the **Gallery** screen.
- [ ] Verify that thumbnails for images appear, and that video entries show a placeholder label.
- [ ] Tap an image thumbnail to ensure it opens in the system preview (or a custom viewer if implemented).
- [ ] Verify pull‑to‑refresh (if implemented) reloads the media list.

## 6. Overall Stability
- [ ] Run the app for at least 5 minutes performing the above actions repeatedly.
- [ ] Monitor the Logcat (Android) and Xcode console (iOS) for any uncaught exceptions or crashes.
- [ ] Ensure there are no memory leaks (e.g., listeners are properly removed on unmount).

**Notes:**
- If any step fails, capture a screenshot/log and create a corresponding issue.
- Remember to test on both Android and iOS (iOS hardware support for Bluetooth and CameraX is limited; verify only the parts that are functional on iOS).