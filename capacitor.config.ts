import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.niilano.marketplace',
  appName: 'NM',
  webDir: 'dist/app/browser',
  bundledWebRuntime: false,
  plugins : {
    GoogleAuth : {
      scopes : ["profile","email"],
      serverClientId : "30578003989-fvauhmek8m2hp0gajaia6hqh3g9rohai.apps.googleusercontent.com",
      forceCodeForRefreshToken : true
    }
  }
};

export default config;