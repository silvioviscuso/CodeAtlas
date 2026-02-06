import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'CodeAtlas',
  slug: 'codeatlas',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'codeatlas',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.codeatlas.app',
    infoPlist: {
      NSUserNotificationsUsageDescription: 'CodeAtlas needs permission to send you notifications about pull request reviews.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.codeatlas.app',
    permissions: ['android.permission.POST_NOTIFICATIONS'],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#6366f1',
      },
    ],
  ],
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:3000',
  },
});
