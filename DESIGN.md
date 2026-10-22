# ShutterTap — Design System (canonical specification)

This file is the canonical design specification. It describes the visual
language actually implemented in this repository. Any new screen must follow
it; any deviation must update this file first.

Reference inspiration lives in `design/references/` (bluetooth-discovery,
headphone-connecting, camera-interface, gallery-interface). Those images are
inspiration only — no names, logos, or assets were copied.

## A. Product design vision

ShutterTap turns Bluetooth earbuds into a wireless camera shutter. The app is
a hardware remote first and a gallery second: **link → map → capture →
review**. The visual identity is *midnight violet*: a dark-first, calm,
technical instrument with one confident violet accent, quiet surfaces, and
chrome that gets out of the camera's way.

- **Personality:** precise, calm, capable. A tool, not a toy. No playful
  gradients-as-decoration, no gamified copy.
- **Experience goal:** from cold start, a user understands the link status
  within seconds (Home), can scan and connect (Device), assign taps
  (Gesture), shoot (Camera), review (Gallery), and diagnose button presses
  (Media) — each in under three taps.
- **iOS / Android:** one visual language, native conventions where they
  differ (safe areas, status bar style, permission wording). No
  platform-forced identical behavior.
- **Hardware relationship:** Bluetooth, camera, gestures, media buttons, and
  gallery are facets of one pipeline. The UI always reflects the *actual*
  bridge state: scanning, connecting, linked, recording, or explicitly
  unavailable. Decorative animation never stands in for state.

## B. Design principles

1. **Functionality before decoration.** If an element doesn't communicate
   state or afford an action, remove it.
2. **Real state, always.** No fake devices, no simulated connections, no
   placeholder photos. Missing bridges render explicit unavailable states.
3. **Minimal clutter.** One primary action per screen; secondary actions are
   ghost buttons or icon buttons.
4. **Clear hierarchy.** Screen title → status → primary action → supporting
   content. Same order on every tab.
5. **Reusable components.** Screens compose `src/components/*`; one-off
   StyleSheets hold only layout glue, never new colors or type styles.
6. **Native-feeling behavior.** 44pt targets, pressed-scale feedback,
   safe-area compliance, keyboard/modals per platform convention.
7. **Accessible by default.** Labels on every control, contrast-checked
   pairs, reduced-motion honored, status conveyed in text (never color
   alone).
8. **Predictable navigation.** Six bottom tabs, unchanged order
   (Home · Device · Gesture · Camera · Gallery · Media); headers don't
   duplicate the tab bar.
9. **Responsive layouts.** No fixed widths that break on small/large
   phones; gallery columns adapt (`<700pt` → 3, `≥700pt` → 5); camera
   chrome keys off safe-area insets.
10. **Honest feedback for hardware.** Every async hardware op has
    idle → working → success/error copy, plus retry where the bridge
    supports it.

## C. Color system

Tokens live in `src/theme.ts` (`darkColors` / `lightColors`). Dark is the
lead theme; light mirrors it with contrast-adjusted accents.

| Token | Dark | Light | Usage |
|---|---|---|---|
| `background` | `#0B0B12` | `#F4F3F7` | App background |
| `elevated` | `#12121A` | `#ECEAF1` | Tab bar, segmented track, press wells |
| `card` | `#17171F` | `#FFFFFF` | Cards, sheets, tiles |
| `cardPressed` | `#20202B` | `#EDEBF4` | (reserved) pressed card |
| `primary` | `#8B5CF6` | `#7C3AED` | Brand violet; primary buttons, active tabs |
| `primaryBright` | `#A78BFA` | `#8B5CF6` | Active accents on dark, scan core |
| `primaryDeep` | `#6D28D9` | `#6D28D9` | Pressed brand states |
| `primarySoft` | violet 14% | violet 10% | Icon medallions, badges, radar rings |
| `secondaryAccent` | `#14B8A6` teal | `#0D9488` | Secondary highlights |
| `tertiaryAccent` | `#F97316` coral | `#EA580C` | Recording-adjacent/warm highlights |
| `text` | `#F5F3FC` | `#16151D` | Primary text |
| `textSecondary` | `#B9B4CC` | `#5B566E` | Body secondary, hints |
| `textMuted` | `#807A96` | `#8A849E` | Captions, inactive tabs, placeholders |
| `border` | `#2A2A36` | `#E2DFEB` | Card/tab outlines (dark uses hairlines) |
| `divider` | `#1D1D27` | `#ECE9F3` | Row separators |
| `success` | `#34D399` | `#047857` | Connected, saved, captured |
| `warning` | `#FBBF24` | `#B45309` | Connecting, storage warnings |
| `error` | `#F87171` | `#B00020` | Failures, recording-stop, destructive |
| `info` | `#60A5FA` | `#1D4ED8` | Informational notices |
| `disabled` / `onDisabled` | `#33333F` / `#6E6A82` | `#D9D6E1` / `#8A849E` | Disabled controls |
| `onBrand` | `#FFFFFF` | `#FFFFFF` | Text/icons on brand fills |
| `overlay` | black 72% | ink 55% | Modal dim |
| `scrim` | black 55% | ink 35% | Gallery preview dim |
| `cameraChrome` | `#000000` | `#000000` | Camera screen (both themes) |
| `cameraControl` | `#FFFFFF` | `#FFFFFF` | Shutter, camera icon buttons |
| `cameraMuted` | `#B9B4CC` | `#B9B4CC` | Secondary text on camera black |
| `cameraWell` | `#17171F` | `#17171F` | Medallion wells on camera black |
| `scanRing` | brand violet | deep violet | Radar rings/glow |

Purple was kept as the accent (continuity with the original palette and the
Bluetooth reference's glow), but restrained: brand fills, active states, and
discovery visuals only — never body text or large surfaces. The camera screen
is pure black in both themes so the preview is maximal and controls read as
aperture hardware.

## D. Typography

System type (San Francisco / Roboto), defined in `typography`:

| Style | Size / Line / Weight | Usage |
|---|---|---|
| `display` | 32/38 · 700 | (reserved) hero numbers |
| `screenTitle` | 24/30 · 700 | Screen headers |
| `sectionTitle` | 17/22 · 700 | Section labels, radar status, sheet titles |
| `cardTitle` | 16/21 · 600 | Card titles, state titles |
| `body` / `bodyStrong` | 15/22 · 400/600 | Body copy, device names |
| `secondary` | 14/20 · 400 | Hints, subtitles, help text |
| `caption` | 12/16 · 500 | Meta, eyebrows, filenames |
| `button` / `buttonSmall` | 16/22 · 600 / 14/19 · 600 | Buttons |
| `tabLabel` | 11/14 · 600 | Tab bar labels |
| `status` | 13/18 · 600, +0.4 tracking | Badges, REC pill, mode tags |
| `numeric` | 13/18 · 500 | Addresses, RSSI, timestamps |

Rules: titles never truncate mid-word without `numberOfLines`; device names
and statuses clamp to 1–2 lines; all-caps is reserved for eyebrows and
camera mode tags.

## E. Spacing system

4pt grid in `spacing`: `xxs 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 20 · xxl 24 ·
xxxl 32 · huge 48`. Semantic aliases: `screen 16` (edge padding),
`cardGap 12` (stacked cards), `galleryGap 2` (tight grid, per reference).

Application: screen edges `screen`; header bottom `lg`; stacked cards
`cardGap`; card interiors `lg`; rows `md` vertical; button internal gap
`sm`; gallery tiles `galleryGap`; sheets `xxl`. No arbitrary values.

## F. Shape and elevation

`radii`: `xs 6 · sm 8 · md 12 · lg 16 · xl 20 · xxl 28 · full 9999`.
Buttons are pills (`xxl`); cards `lg`; icon medallions `12–16`; badges,
segments, and status pills `full`; shutter 76pt circle, 4pt ring.

Elevation: dark theme uses 1pt `border` hairlines (shadows are invisible on
near-black); light theme uses soft shadows (`shadowOpacity 0.08, radius 12,
y 4, elevation 2`) plus `elevation.card/floating` for overlays. No
gradients; glow is reserved for the radar core and REC dot.

## G. Iconography

`src/components/AppIcon.tsx` — a zero-dependency geometric set drawn with
View primitives on a 24pt grid (28 names: home, bluetooth, gesture, camera,
gallery, media, check, x, alert, info, help, refresh, chevrons, arrowLeft,
flash, swap, plus, play, pause, stop, video, headphones, image, search,
record, signal, lock). Stroke ≈ 9% of size; filled tiles (gallery) and
rings (gesture) match the stroke rhythm.

Rules: one set only (no mixing with other libraries); 20–24pt in rows,
44pt medallions for states, 64–88pt for radar/camera hero; color always a
theme token (active = brand, inactive = `textMuted`) — every call site
passes an explicit token and the component default (`#FFFFFF`) is only a
fallback for unthemed chrome contexts; decorative only —
parents own the `accessibilityLabel`. No Unicode symbols or emoji as icons
(the `help` glyph is a typeset "?", not an icon substitute). To add an
icon, extend `IconName` + `renderMark` with grid coordinates; never inline
a one-off drawing in a screen.

## H. Component system

All in `src/components/`:

- `Screen` (`ui.tsx`) — safe-area root; `padded` (default edge padding),
  `scrollable`, `immersive` (camera: black, no insets of its own).
- `AppHeader` — title + subtitle + optional right node.
- `Card`, `SectionHeader` (title + optional action), `Divider`,
  `StatusBadge` (tones brand/success/warning/error/info/neutral; dot + text,
  never color alone), `SegmentedControl` (camera mode), `SettingRow`.
- `Button` (`buttons.tsx`) — variants primary/secondary/ghost/danger,
  sizes md (50pt) / sm (40pt), icon, loading, disabled, fullWidth. The only
  button implementation.
- `IconButton` — 44pt target, ghost/filled/chrome (camera) variants.
- `ShutterButton` — 76pt ring + white core (red rounded core while
  recording).
- `EmptyState` / `LoadingView` / `ErrorView` / `NoticeCard` (`states.tsx`) —
  medallion + title + message + optional action; notices are tinted
  info/warning/brand cards for unavailable states.
- `ScanRadar` / `DeviceCard` / `ConnectingOverlay` (`device.tsx`) —
  discovery visual driven by the real `scanning` flag; device rows with
  avatar, address, RSSI signal bars, paired mark, Connect/Connected;
  connecting modal with spinner ring, error + retry, cancel.
- `src/native/modules.ts` — the only door to `BluetoothModule`,
  `CameraModule`, `MediaButtonModule`; returns `undefined` until ST-P0-07 /
  ST-P3-01 land. Screens never touch `NativeModules` directly.

New components go in these files by family; a new file only for a new
family. Props must accept theme-driven colors, never hardcoded hex.

## I. Motion and interaction

- Pressed: scale 0.97 + opacity 0.88 (buttons), 0.94/0.7 (icon buttons),
  0.92 (shutter). Durations `fast 150 · base 220 · slow 350`, cubic-out.
- Radar: 2200ms expanding rings, only while `scanning === true`.
- Connecting spinner: 1600ms ring rotation, only while the modal is open.
- Capture: status-pill copy updates ("Capturing photo…" → "Photo saved:
  <uri>"); REC pill shows a live `m:ss` timer.
- Modals fade (`ConnectingOverlay`, gallery preview).
- Reduced motion: radar checks `AccessibilityInfo.isReduceMotionEnabled`
  and renders a static state when set. No looping animation runs without a
  matching hardware state, and nothing auto-plays on the gallery grid.

## J. Screen-by-screen specifications

All six existing tabs were redesigned; no screens added or removed.

**Home** — purpose: at-a-glance link status + routing. Layout: header with
app mark; link-status card (eyebrow, device name or "Not connected",
context line, status badge, Scan/Stop + "Open devices"); "Get started"
2×2 tile grid (Connect/Camera/Gestures/Gallery); "No earpiece linked" empty
state when idle. States: loading N/A (context is synchronous); error =
context `error` inline; connecting = amber "Connecting…". A11y: status
badge exposes "Status: …"; tiles are labeled buttons. Nav: tiles navigate
to tabs; no stack.

**Device (discovery + connection)** — purpose: scan, identify, connect.
Layout: header; `ScanRadar` hero (static rings idle, pulsing rings + violet
core while scanning); status headline + guidance; Scan/Stop + Help actions;
collapsible troubleshooting card (4 tips); "Nearby devices" list of
`DeviceCard`s. Connection: tapping Connect opens `ConnectingOverlay`
(spinner + "Connecting…" + device name; error variant with Retry/Dismiss;
Cancel always available). Empty: "No devices yet" + scan CTA. Error: inline
`ErrorView` with retry. A11y: radar announces scanning state; overlay is an
alert dialog. Platform: same layout; permission wording follows each OS
when bridges land.

**Gesture** — purpose: map 4 earbud gestures to 6 camera actions. Layout:
header; unavailable/save-error notices; single card list (icon, title,
hint, action pill); footer explainer. Interaction: tapping a row cycles its
action and persists via `setGestureMappings` (existing behavior kept);
pill is violet when an action is assigned, neutral for `NONE`/`Not set`.
Empty: "No mappings yet" if the bridge returns `[]`. Unknown native state
renders "Not set" — never a guessed action. A11y: each row announces
gesture, current mapping, and "tap to change".

**Camera** — purpose: maximal preview, minimal chrome. Layout (all black):
top bar (flash toggle w/ amber active state, mode tag or live REC timer,
camera switch); edge-to-edge preview; status toast pill; bottom bar
(PHOTO/VIDEO segmented control; gallery shortcut · shutter · contextual
stop). States: initializing = "Ready"; capturing/recording toasts;
unavailable = centered camera medallion + ST-P0-07 note (controls stay for
layout verification). Switching mode while recording is allowed by UI but
the bridge owns behavior. A11y: every chrome button labeled; REC pill
announces time; safe areas from insets (notch/dynamic island/home bar).
No decorative overlay ever covers the preview.

**Gallery** — purpose: review captures. Layout: header with item count;
3-column grid (`≥700pt` → 5), 2pt gaps, square tiles; video tiles show a
video glyph + filename (no fake playback); tap a photo → fullscreen preview
modal with filename + close. States: skeleton/loading, empty ("No captures
yet"), error + retry, unavailable notice, pull-to-refresh (bridge only).
Performance: `keyExtractor` by URI, `numColumns` keyed re-layout, no
per-tile re-renders, `cover` thumbnails. A11y: tiles announce photo/video
+ filename; modal closes on back/gesture.

**Media** — purpose: diagnose earbud button presses. Layout: header with
event count + Clear; unavailable notice; empty state ("No button presses
yet"); reverse-chronological event cards (icon per type, label, timestamp).
Events stream from `onMediaButton`; feed is session-local with Clear.
A11y: list items are plain text (screen-reader friendly).

## K. Camera design

Specified in J + H/I above; additionally: preview `View` is the flex-1
middle band (never letterboxed by chrome); top/bottom bars are transparent
over black with 44pt+ targets; flash/switch icons are `chrome` variant
(white on 45% black); photo capture uses `ShutterButton`, video uses the
same button (toggles start/stop) plus a stop `IconButton` while recording;
permission-denied / init-failure / capture-failure all surface as status
copy + unavailable card — the preview `View` is never replaced by a static
image. `findNodeHandle` binding is isolated in the mount effect with
try/catch (Fabric command migration lands with the native view manager in
ST-P0-07; see Q).

## L. Bluetooth design

State machine (all wired to `BluetoothContext`): idle → scanning (radar
pulse, "Looking for devices nearby…", Stop action) → discovered (device
cards with RSSI/paired marks) → connecting (overlay, cancellable) →
connected (success badge, "Linked" status, Home reflects it) / failed
(overlay error copy + Retry + Dismiss; inline error on Device). Stop-scan
and overlay Cancel are always reachable. Empty results after a scan show
the empty state + Help. Troubleshooting tips cover pairing mode, distance,
prior pairings, and toggling phone Bluetooth. Nothing renders from mocked
data at any point.

## M. Gallery design

Specified in J; additionally: tile size derives from `useWindowDimensions`
(recomputes on rotation/foldables); modal preview is `contain`-fit on a
scrim; videos are explicitly non-playable tiles until a player lands
(documented, not faked); large libraries rely on FlatList virtualization
with stable URI keys.

## N. Accessibility

- Contrast: text pairs chosen from opposite ends of each theme (primary
  text on background ≈ 15:1 dark; deep violet `#7C3AED` on light card for
  the primary accent instead of `#8B5CF6`).
- Labels: every button/icon-control has `accessibilityLabel`; states expose
  `accessibilityRole` (header/tab/alert/button); decorative icons are
  `accessible={false}`.
- Targets: ≥44pt everywhere (`touchTargetMin`), plus 8pt hitSlop on
  touchables.
- Screen reader: status conveyed as text in badges/rows (never color
  alone); timestamps are real localized strings.
- Dynamic text: layouts use flex + wrapping + `numberOfLines` guards; no
  fixed-height text boxes that clip at larger sizes.
- Reduced motion: radar static when the OS requests it; no parallax,
  no autoplay.
- Modals: `onRequestClose` wired (Android back), alert roles, dismiss
  always reachable.

## O. Platform considerations

- Safe areas via `react-native-safe-area-context` (`Screen` + camera
  insets); tab bar keeps its own platform padding.
- StatusBar follows scheme (`light-content` dark / `dark-content` light).
- Permission prompts and Bluetooth/camera wording stay generic in JS; exact
  OS strings come from the native side when bridges land.
- Camera chrome is identical on both platforms (full-bleed black is the
  convention on both); modal presentation uses the platform default fade.
- No keyboard-bearing screens exist yet; when inputs land, behavior follows
  per-platform `KeyboardAvoidingView` conventions.

## P. Implementation mapping

| Design concern | Code location |
|---|---|
| Colors, type, spacing, radii, motion | `src/theme.ts` (`darkColors`, `lightColors`, `typography`, `spacing`, `radii`, `motion`); `useAppTheme()`; `withAlpha(hex, alpha)` is the only way to derive translucent variants (validated append, opaque fallback) |
| Navigation themes | `lightTheme` / `darkTheme` in `src/theme.ts` (consumed by `App.tsx`) |
| Icons | `src/components/AppIcon.tsx` |
| Layout/surfaces | `src/components/ui.tsx` |
| Buttons | `src/components/buttons.tsx` |
| Loading/empty/error/notice | `src/components/states.tsx` |
| BT visuals | `src/components/device.tsx` |
| Native access | `src/native/modules.ts` (only importer of `NativeModules` for bridges) |
| Screens | `src/screens/*.tsx` consuming the above |
| Tabs | `src/navigation/BottomTabs.tsx` |

Rules for new work: consume tokens via `useAppTheme()`; add icons to
`AppIcon`, not screens; add states to `states.tsx`, not inline; reach
bridges only through `src/native/modules.ts`; keep legacy `palette` /
`lightTheme` / `darkTheme` / `useTheme` exports stable (navigation depends
on them). Tests in `__tests__/DesignSystem.test.tsx` lock the tokens and
every icon's render.

## Q. Acceptance criteria

- [x] `DESIGN.md` (this file) matches the shipped code.
- [x] Zero hardcoded hex outside `src/theme.ts` (icons take `color` props;
  camera chrome uses `cameraChrome`/`cameraControl` tokens).
- [x] All 6 tabs render loading/empty/error/unavailable states from real
  bridge state.
- [x] `npx tsc --noEmit` passes; `npx eslint .` has 0 errors;
  `npm test` passes (50 tests: tokens, `withAlpha`, icons, components,
  bridge layer, all 6 screens, Bluetooth error paths).
- [x] No new dependencies; no native changes; no behavior changes to
  bridge calls, persistence, or navigation structure.
- [x] No fake devices, connections, photos, or events anywhere.
- [ ] Physical-device pass (Bluetooth radio, camera capture, media buttons,
  MediaStore listing) — blocked on hardware; see TEST_CHECKLIST.md.
- [ ] Interactive simulator walkthrough (tab taps, rotation, light/dark) —
  pending owner run; static checks are green.

Known pre-existing items intentionally untouched: ST-P0-07/ST-P3-01 native
ports, ST-P1-05 `findNodeHandle` Fabric migration (isolated + documented
above), release packaging, 16 KB page-size diagnosis.
