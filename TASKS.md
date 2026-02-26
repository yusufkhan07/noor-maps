# Noor Maps — Task Backlog

## Bug Fixes

### [BUG] Search bar overlaps the map compass
- The `SearchBar` wrapper uses `right: 16` which extends into the top-right corner where MapKit renders the compass.
- **Fix:** Increase the right inset so the compass is fully visible. Already partially addressed by changing `right` to `60` — needs verification on device that the compass is fully clear.

---

## UI & Polish

### [FEATURE] Show user's current location on the map
- Display a "blue dot" (or equivalent) on the `MapsScreen` map indicating the user's current location.
- Use the location permission already requested by `expo-location` — no additional permission flow needed.
- MapKit on iOS supports this natively via the `showsUserLocation` prop on `MapView` — enable it.
- Add a "re-centre" button (e.g. bottom-right corner) that animates the map back to the user's location if they have panned away.

### [TASK] Add icon library and replace all emoji icons
- Install an icon library (e.g. `@expo/vector-icons` which bundles Ionicons, MaterialIcons, etc. — already available in Expo, or `react-native-vector-icons`).
- Replace all emoji icons currently used in the app (e.g. `★`, `🗺`, `☰` in `App.tsx` tab bar, and any others across screens/components) with proper vector icons.
- Ensure icons scale correctly across device sizes and respect system dark/light mode where applicable.

### [FEATURE] Dark mode / theme support
- The app should automatically follow the device's light/dark mode setting (`Appearance` API in React Native / `useColorScheme` hook).
- Create a `ThemeContext` (or integrate into an existing context) that exposes the current theme and themed colour tokens.
- All screens and components should consume theme colours from the context rather than hardcoded values.
- Styles should be updated across the entire app to support both themes.
- Tab bar, bottom sheets, modals, and map overlays all need dark variants.

---

## Prayer Times Display

### [FEATURE] Show Asr 1 and Asr 2
- The prayer times table in `MosqueBottomSheet` currently shows a single Asr time.
- Some mosques follow the Hanafi madhab (Asr 2) and some the Shafi'i madhab (Asr 1) — many offer both.
- Update the data model, backend, and UI to support two separate Asr fields (`asr_1`, `asr_2`).
- Both should be shown as separate rows in the prayer times table when both are present.

### [FEATURE] Show Jummah 1 and Jummah 2
- Some mosques hold two Jummah (Friday prayer) congregations.
- Add optional `jummah_1` and `jummah_2` fields to the prayer times data model and backend.
- Display both in the prayer times table when present; hide if not set (optional for the mosque).
- The `AddTimingsModal` should allow entering 0, 1, or 2 Jummah times.

### [FEATURE] Show next prayer time
- In the `MosqueBottomSheet`, highlight or display which prayer is coming up next and how long until it starts.
- Use the device's current local time compared to the mosque's prayer times to determine the next prayer.
- Display format: e.g. "Next: Asr in 1h 24m" — shown prominently near the top of the bottom sheet.
- Must account for timezone (see timezone task below).

### [FEATURE] Timezone handling
- Prayer times stored in the database are local times (no timezone info). The app must display them correctly regardless of where the user's device is set.
- **Decision needed:** Store times as plain `HH:MM` strings (timezone-naive, interpreted as local mosque time) vs. storing with UTC offset.
- Recommended approach: store as `HH:MM` strings and attach the mosque's IANA timezone (derived from its coordinates using a reverse-geocoding or timezone lookup library e.g. `geo-tz`).
- On the frontend, use the mosque's timezone (not the device timezone) when displaying times and calculating "next prayer".
- This affects: prayer times table display, next-prayer countdown, and push notification scheduling.

---

## Community & Data Quality

### [FEATURE] Mosque amenities
- Each mosque should display a set of amenities indicating available facilities.
- Amenities (all boolean, stored on the `mosques` table):
  - Female prayer section
  - Toilets / Wudu facilities
  - Wheelchair accessible
  - Parking
- Display amenities as icon+label chips in the `MosqueBottomSheet` (e.g. below the mosque name / address).
- Greyed-out or hidden when not available — TBD on design (show all with ticked/unticked vs. show only available ones).
- Admin/backend: amenities should be editable via the Supabase dashboard initially; a user-facing "suggest correction" flow can come later.
- **Post-MVP:** Allow filtering/searching mosques on the map by amenity (e.g. "show only mosques with female section"). See Post-MVP section.

### [FEATURE] Submit a missing mosque
- Allow users to report a mosque that is not yet in the database.
- Entry point: a button in the MapsScreen (e.g. floating button or in the menu).
- Form fields: mosque name, address / location (with map picker or auto-detect current location), optional notes.
- Submission stored in a Supabase table (e.g. `mosque_submissions`) for admin review before being added to the main `mosques` table.
- Requires authentication — prompt unauthenticated users to sign in before submitting.

### [FEATURE] Report an incorrect or closed mosque
- Allow users to flag a mosque as incorrect (wrong location, wrong name) or permanently closed / no longer exists.
- Entry point: a "Report" option in the `MosqueBottomSheet` (e.g. a small link or icon in the action bar).
- Report types: "Wrong location", "Wrong name", "Mosque closed / no longer exists", "Other".
- Submissions stored in a Supabase table (e.g. `mosque_reports`) linked to the `mosque_id` and the reporting `user_id`.
- Requires authentication — prompt unauthenticated users to sign in before reporting.
- Backend: if a mosque accumulates a threshold of "closed" reports (e.g. 3+), flag it for admin review.

---

## Gamification & Leaderboard

### [FEATURE] Contribution points system
- Award points to users for community contributions: submitting prayer times, reporting closed mosques, submitting missing mosques, etc.
- Points stored in Supabase against the user's profile (e.g. a `contributions` table or a `points` column on the `profiles` table).
- Define a points scale — e.g. prayer time submission = 10 pts, mosque report = 5 pts, new mosque submission = 20 pts.
- Points should be visible to the user (e.g. in their profile on the Menu screen).

### [FEATURE] Leaderboard screen
- A leaderboard showing the top contributors ranked by total points.
- Accessible quickly — either as a tab in the bottom tab navigator or as a prominent button on the Menu screen.
- Show: rank, display name / avatar, and point total for each user.
- The current user's own rank should always be visible (sticky row at the bottom if they're outside the top N).
- Data served from Supabase (a view or query over the `contributions` / `profiles` tables).

### [FEATURE] Contribution rate limit — 2 submissions per 6 hours per mosque
- Replace the existing "1 per 24 hours" rate limit on prayer time edits.
- New rule: **2 submissions per mosque per 6-hour window** per user.
- Enforce on the backend: track `(user_id, mosque_id, submitted_at)` in `timing_submissions`; reject with `429` if 2 or more submissions exist within the last 6 hours for that mosque.
- **Frontend:** Update the confirmation popup copy to reflect the new limit ("You can submit up to 2 times per mosque every 6 hours").
- **Frontend:** Show the user's remaining submissions for the current window somewhere visible in `AddTimingsModal` (e.g. "2 submissions remaining this window").
- **Frontend:** On `429`, show an error message with the time until the window resets.

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
- **Note:** This task will be superseded by the "2 submissions per 6 hours" gamification task above — implement that one instead if starting fresh.

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

### [FEATURE] Filter mosques by amenity
- Add filter controls on the MapsScreen (e.g. a horizontal chip bar or a filter sheet) to show only mosques matching selected amenities.
- Filters: Female prayer section, Toilets, Wheelchair accessible, Parking.
- Multiple filters should be combinable (AND logic — mosque must have all selected amenities).
- Filtered results should update the map pins in real time.
- Requires the amenities task (MVP) to be completed first.

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
