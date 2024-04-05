import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.niilano.marketplace',
  appName: 'Niilano',
  webDir: 'dist/app/browser',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '30578003989-fvauhmek8m2hp0gajaia6hqh3g9rohai.apps.googleusercontent.com',
        androidClientId : '30578003989-0lrrr78h6bf4p7vic427onl7g1jgq0ga.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#de0f17',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
