# CodeAtlas Mobile App

React Native mobile app (iOS & Android) built with Expo for CodeAtlas code review notifications and management.

## Features

- **Authentication**: GitHub OAuth integration
- **PR Reviews**: View AI-powered code review summaries
- **Notifications**: Push notifications for review completions and alerts
- **Filtering**: Filter reviews by severity (critical, high, etc.)
- **Detail Views**: Drill down into specific findings and suggestions

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Query for server state
- **Styling**: React Native StyleSheet
- **Type Safety**: TypeScript

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Set `API_URL` to your backend API endpoint.

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator (requires macOS + Xcode)
   - Press `a` for Android Emulator (requires Android Studio)
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
app/
  _layout.tsx              # Root layout with providers
  index.tsx                # Home screen
  screens/                 # Screen components
    PullRequestListScreen.tsx
    PullRequestDetailScreen.tsx
    SettingsScreen.tsx

src/
  components/              # Reusable components
    ReviewSummaryCard.tsx
  contexts/                # React contexts
    AuthContext.tsx
    NotificationContext.tsx
  services/                # API client and services
    apiClient.ts
```

## Building for Production

### iOS

```bash
npm run build:ios
```

Requires:
- Apple Developer account
- Expo EAS Build account (or local build setup)

### Android

```bash
npm run build:android
```

Requires:
- Google Play Developer account (for Play Store)
- Expo EAS Build account (or local build setup)

## Development Tips

- Use Expo DevTools for debugging
- Hot reload is enabled by default
- Check Expo documentation for native module setup
- Use React Query DevTools in development

## Testing

```bash
npm test
```

Tests use Jest and React Native Testing Library.
