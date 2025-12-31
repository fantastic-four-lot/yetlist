// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';
// r

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       {/* <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} /> */}
//       <Stack>
      
//         <Stack.Screen name="" options={{ headerShown: false }} />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="TravelPlanning"  options={{ headerShown: false }} />
//       </Stack>
//     </ThemeProvider>
//   );
// }





// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './lib/auth/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

function RootRouter() {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Checking session…</Text>
      </View>
    );
  }

  console.log('Auth state:', { user });

  return (
     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        // Logged in -> go to tabs/app
        <Stack.Screen name="(tabs)" />
      ) : (
        // Not logged in -> show auth stack
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
    </ThemeProvider>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootRouter />
    </AuthProvider>
  );
}
