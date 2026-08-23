# UM Fixhub — Mobile App

Campus facility issue reporting app for University of Mindanao students and facilities staff. Built with Expo (React Native) and NativeWind.

## Tech Stack

- **Expo** (React Native) with Expo Router for file-based navigation
- **NativeWind** (Tailwind CSS for React Native) for styling
- **TypeScript**

## Getting Started

```bash
npm install
npx expo install expo-image-picker   # if not already installed
npx expo start -c
```

Press `w` to preview in a browser, or scan the QR code with Expo Go on your phone (same Wi-Fi network required).

## Project Structure

```
src/
├── app/
│   ├── index.tsx           Landing / onboarding screen
│   ├── login.tsx            Student login
│   ├── signup.tsx           Student sign up
│   ├── (tabs)/               Student-facing app (Home, Report, My Reports, Updates)
│   │   ├── home.tsx
│   │   ├── report/            Report flow: category -> form -> confirmation
│   │   ├── my-reports/        List + detail/tracking screen
│   │   └── updates.tsx
│   └── (admin)/               Admin panel (Dashboard, Reports, Team, Analytics, Settings)
├── context/
│   └── reports-context.tsx   Shared in-memory report data (student + admin both read/write this)
├── data/
│   ├── categories.ts          Issue category metadata
│   ├── staff.ts                Maintenance staff roster
│   └── current-user.ts        Mock signed-in student/admin (until real auth is connected)
```

## Current Status

**Working:**
- Full student flow: browse -> sign up/log in -> report an issue (with real camera/photo library access) -> track status -> see notifications
- Full admin panel: dashboard stats, searchable/filterable report list, assign staff + update status, team roster, analytics, settings
- Student and admin share the same live report data - an admin update (status, assigned staff) is reflected immediately in the student's tracking screen

**Not yet connected (known next steps):**
- No real backend - all data lives in memory and resets on reload. Connecting to the Laravel API is the next milestone.
- No real authentication - Login/Sign Up accept any input and just navigate through; there's no admin login gate either (`/dashboard` is reachable directly).
- Admin Team/Analytics screens use static placeholder data, not real staff records or historical metrics.

## Design Tokens

| Token | Hex |
|---|---|
| Maroon (primary) | `#A1000B` |
| Mustard (accent) | `#E3A72F` |
| Cream (background) | `#FAF7F2` |
| Ink (text) | `#2A1015` |

Configured in `tailwind.config.js` as `maroon`, `mustard`, `cream`, `ink`.
