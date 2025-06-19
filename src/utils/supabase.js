import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ypuawulonayvvvqqrsma.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdWF3dWxvbmF5dnZ2cXFyc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU2NjQsImV4cCI6MjA2NTgxMTY2NH0.vijNwbodRxaramb1fproF2rGrhsvMrQT6SUHq3i-KsQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})