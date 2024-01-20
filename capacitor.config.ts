import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Sportciety',
  webDir: 'www',
  plugins: {
    'PushNotificatins':{
      'presentationOptions': ['badge', 'sound', 'alert']
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
