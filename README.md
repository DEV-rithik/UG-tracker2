# UG Life Tracker

Track your entire undergraduate journey — week by week, semester by semester.

## About

UG Life Tracker is a personal journaling and tracking tool for undergraduate students. It maps out all 210 weeks of a 4-year degree, letting you score each week (1–5), write reflections, and set goals. All data is stored locally in your browser — no account, no server, no tracking.

## Features

- **Week Grid** — Visual heatmap of all 210 weeks organized by year and semester
- **Scoring** — Rate each week 1–5 (Poor → Excellent) with remarks and next-week goals
- **Holiday Tracking** — Holiday breaks tracked separately with a distinct blue color scheme
- **Statistics Dashboard** — Score trend line chart, semester comparison bar chart, and score distribution pie chart
- **Data Backup** — Export and import your data as a JSON file
- **PWA Support** — Installable as a standalone app with offline support via service worker
- **Custom Semesters** — Optionally adjust individual semester start/end dates during setup

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- Dexie.js (IndexedDB wrapper for local storage)
- Recharts

## Getting Started

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

## Usage

1. Enter the first day of your undergraduate program
2. (Optional) Adjust individual semester dates
3. Click **Build My Calendar**
4. Click any past or current week to score it and add reflections
5. Use the **Statistics** tab to view trends and insights
6. Use the **Data** tab to export/import backups

## Privacy

All data is stored locally in your browser using IndexedDB. Nothing leaves your device.

## Building the Android APK

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Android Studio](https://developer.android.com/studio) installed
- Android SDK configured

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build and sync:**
   ```bash
   npm run cap:build
   ```

3. **Open in Android Studio:**
   ```bash
   npm run cap:open
   ```

4. **Build the APK:**
   - In Android Studio: `Build → Build Bundle / APK → Build APK`
   - The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

5. **Transfer to your phone and install!**

### Quick Run (with device connected)
```bash
npm run cap:run
```

