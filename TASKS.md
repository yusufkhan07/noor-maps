# Noor Maps — Task Backlog

## Bug Fixes

### [BUG] Search bar overlaps the map compass
- The `SearchBar` wrapper uses `right: 16` which extends into the top-right corner where MapKit renders the compass.
- **Fix:** Increase the right inset so the compass is fully visible. Already partially addressed by changing `right` to `60` — needs verification on device that the compass is fully clear.

---

## Backend

### [FEATURE] Script to seed / recalculate mosque data
- We need a backend script (e.g. `apps/api/src/scripts/seedMosques.ts`) that can be run manually to populate or recalculate mosque records.
- Details to clarify: what data needs recalculating? Prayer times? Distances? Coordinates?

### [FEATURE] Rate limiting for editing prayer times
- Only authenticated users can submit prayer time edits (gate the `PATCH /mosques/:id/timings` endpoint).
- Each user is limited to **one submission per mosque per day**.
- Rate limit should be enforced on the backend — store `(user_id, mosque_id, submitted_at)` in a Supabase table (e.g. `timing_submissions`).
- The `PATCH` handler should reject with `429` if the user has already submitted today for that mosque.
- **Frontend:** Before the user confirms submission in `AddTimingsModal`, show a confirmation popup warning them:
  - That this affects prayer times for the whole community.
  - To double-check the times are correct before submitting.
  - That they can only submit once per day.
- **Frontend:** If the backend returns `429`, show an error message explaining the daily limit has been reached.

---

## Auth & Monetisation

### [FEATURE] Login screen — Supabase Auth (Google / Apple)
- Auth is **optional** — users can use the app without logging in.
- Login will be **required** in the future to access paid features (ad-free subscription).
- Provider support: Google Sign-In and Sign in with Apple only.
- Use Supabase Auth with `@supabase/supabase-js` on the frontend.
- Requires: Expo AuthSession / `expo-auth-session`, Apple entitlements, Google OAuth client IDs.
- A "Sign in" entry point should exist somewhere accessible (e.g. Menu screen or a prompt when hitting a gated feature).

### [FEATURE] Ads integration
- Display ads for non-paying / non-logged-in users.
- Paid subscription (via IAP) removes ads.
- Ad network TBD (e.g. Google AdMob via `react-native-google-mobile-ads`).
- Requires: IAP setup (RevenueCat or Expo IAP), subscription entitlement check, ad placement in UI.

### [FEATURE] Paid subscription to remove ads
- Users who subscribe should have ads hidden across the app.
- Subscription state should be gated via Supabase (store entitlement server-side after purchase verification).
- Requires login — subscription flow should prompt unauthenticated users to sign in first.

---

## Favourites

### [FEATURE] Favourite a mosque (frontend + backend)
- Users should be able to mark a mosque as a favourite from the `MosqueBottomSheet`.
- The heart/star icon in `MosqueHeader` currently uses local `isFavourite` state — this needs to be persisted (local storage or backend).
- Backend may need a `favourites` table or user-mosque relationship in Supabase.

### [FEATURE] Favourites screen — list of favourited mosques
- `FavouritesScreen` is currently a stub.
- Should display a list of the user's favourited mosques.
- Each item should show mosque name, address, and a notification toggle button.

### [FEATURE] Push notifications for favourited mosques
- Users should receive prayer time notifications for each mosque they have favourited.
- Notification should fire at each prayer time (Fajr, Dhuhr, Asr, Maghrib, Isha).
- Requires: Expo Notifications setup, notification scheduling, permission request flow.

### [FEATURE] Per-mosque notification toggle on Favourites screen
- On the Favourites screen, each mosque entry should have a button to enable/disable notifications for that specific mosque.
- State should be persisted per mosque (local storage or backend).

---

## App Store & Marketing

### [TASK] App icon
- Design and export an app icon at all required resolutions for iOS (App Store submission requires 1024x1024 PNG + various device sizes).
- Icon should reflect the app's purpose — mosque / prayer times / maps.
- Export using Expo's `icon` field in `app.json` (single 1024x1024 source, Expo generates the rest).

### [TASK] App name & App Store description
- Decide on the final app name (currently "Noor Maps" — confirm this is correct).
- Write a short App Store description (up to 170 chars for the subtitle, up to 4000 chars for the full description).
- Write keyword list for App Store search optimisation (100 char limit).

### [TASK] Domain & website
- Purchase a domain (e.g. `noormaps.app` or similar).
- Build a temporary landing page — can be a simple static page (GitHub Pages, Vercel, etc.) with:
  - App name + tagline
  - Short description
  - "Coming soon" / App Store download link placeholder
  - Privacy policy page (required for App Store submission, especially with auth + notifications).

---

## Notifications

### [FEATURE] Notifications tab / screen
- Add a 4th tab to the bottom tab navigator in `App.tsx` (currently: Favourites, Maps, Menu).
- The screen shows a chronological list of all notifications sent to the user (prayer time alerts, etc.).
- Each notification item should show: mosque name, prayer name, time, and date.
- Notifications should be stored locally (e.g. via `AsyncStorage` or `expo-sqlite`) when received so they persist and can be listed here even after the system clears them.
- Empty state when no notifications have been received yet.

---

## Post-MVP

### [FEATURE] Qibla direction
- Show the Qibla direction (direction of Mecca) from the user's current location.
- Can be a compass-style screen or an overlay on the map.
- Use the device's magnetometer via `expo-sensors` (`Magnetometer`) combined with the user's GPS coordinates to calculate the bearing to Mecca (21.4225°N, 39.8262°E).

### [FEATURE] Quran
- Add a Quran reader screen to the app.
- Options: integrate a free Quran API (e.g. `api.alquran.cloud`) or bundle the text locally.
- Features to consider: surah list, verse-by-verse reading, Arabic text + transliteration + translation, bookmarking.

### [FEATURE] Play Adhan at prayer times
- When a prayer time notification fires, play the Adhan audio.
- Use `expo-av` to play a bundled Adhan audio file.
- Should respect the device's silent/ringer switch and volume.
- User should be able to opt in/out per mosque or globally (a setting in the Menu screen).
- Consider different Adhan recitations as a selectable option (e.g. Makkah, Madina).
