import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// استخدم هنا مفاتيح مشروعك
const supabaseUrl = 'https://wejkyudohyjufhvmmukm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlamt5dWRvaHlqdWZodm1tdWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjI2MDksImV4cCI6MjA4MzU5ODYwOX0.N4TqLXFtITyjAgjI_nB2k1_e84kqvtejSK0fPQLY1zY';

// محول لتخزين الجلسة بشكل آمن على الموبايل
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});