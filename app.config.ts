import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Barista Pro',
  slug: 'barista-pro',
  scheme: 'barista',
  orientation: 'portrait',
  platforms: ['android'],
  version: '1.0.0',
  splash: { image: './assets/design/splash.png', resizeMode: 'contain', backgroundColor: '#F8F5F0' },
  icon: './assets/design/logo.png',
  extra: { appVersion: '1.0.0' },
  android: {
    package: 'com.yourcompany.barista',
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#FFFFFF' },
    versionCode: 1,
    permissions: []
  }
});
