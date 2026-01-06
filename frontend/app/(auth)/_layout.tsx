
// app/(auth)/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {

  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  
  useEffect(() => {
    const checkFirstOpen = async () => {
      try {
        const seen = await AsyncStorage.getItem('@has_seen_onboarding');
        setInitialRoute(seen === 'true' ? 'SignIn' : 'Onboarding');
      } catch {
        setInitialRoute('Onboarding');
      }
    };
    checkFirstOpen();
  }, []);

  if (!initialRoute) {
    // splash gate while reading storage
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#5B4B8A" />
      </View>
    );
  }

  
  return (
    <Stack screenOptions={{ headerShown:false }}
    >
      
      <Stack.Screen name="getstart" options={{ title: 'Onboarding' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
    </Stack>
  );
}
