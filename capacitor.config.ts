import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.58c159e0078e4b2da19a6cc1ae77f1ba',
  appName: 'NextUp - Swiss Transport',
  webDir: 'dist',
  server: {
    url: 'https://58c159e0-078e-4b2d-a19a-6cc1ae77f1ba.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorGeolocation: {
      permissions: {
        location: "always"
      }
    }
  }
};

export default config;