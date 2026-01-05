
// // app/(auth)/login.tsx
// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
// import { Link } from 'expo-router';
// import { useAuth } from './../lib/auth/AuthContext';

// export default function Login() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async () => {
//     setErr(null);
//     setLoading(true);
//     try {
//       await login(email.trim(), password);
//     } catch (e: any) {
//       setErr(e.message ?? 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome back</Text>
//       {!!err && <Text style={styles.error}>{err}</Text>}
//       <TextInput
//         placeholder="Email"
//         autoCapitalize="none"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//         style={styles.input}
//       />
//       <Button title={loading ? 'Signing in...' : 'Login'} onPress={onSubmit} disabled={loading} />
//       <View style={{ height: 16 }} />
//       <Link href="/(auth)/register">Create an account</Link>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
//   input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
//   error: { color: 'red', marginBottom: 12 }
// });









import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  useColorScheme,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { useAuth } from '../lib/auth/AuthContext';
import ThemeColors from '@/components/themed-view';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { themeContainerStyle, themeTextStyle, themeCardStyle } =ThemeColors();
  const colorScheme= useColorScheme();
  const insets = useSafeAreaInsets();

  const onLogin = async () => {
    // TODO: your login logic (API call, validation, etc.)
    setErr(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setErr(e.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
    // console.log({ email, password });
  };

  const goToRegister = () => {
    
    // navigation. navigate  ('register');
    router.push("/register"); // OR "../register"
    
  };

  const goToForgotPassword = () => {
    // Navigate to a ForgotPassword screen if you have one
    // navigation?.navigate?.('ForgotPassword');
    console.log('Forgot password');
  };

 
return (
    <View style={styles.safe}>
      {/* KeyboardAvoidingView MUST wrap the part that should move */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // Offset equals top inset (status bar/safe area) + any fixed header height
        keyboardVerticalOffset={insets.top}
      >
        {/* Use ScrollView so content can shrink/scroll when keyboard shows */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tap outside to dismiss keyboard */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {/* Top decorative overlapping circles */}
              <View style={styles.topBlobWrapper}>
                <Svg width="100%" height="140">
                  <Circle cx={-30} cy={-20} r={120} fill={PURPLE} />
                  <Circle cx={110} cy={10} r={75} fill={PURPLE} />
                </Svg>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={[styles.title,{color: colorScheme == "light" ? TEXT_DARK : '#FFFFFF'}]}>Welcome Back</Text>

                {/* Illustration */}
                <View style={styles.illustrationWrapper}>
                  <Svg width={180} height={150}>
                    {/* Phone body */}
                    <Rect x={84} y={12} width={70} height={110} rx={12} ry={12} fill="#FFFFFF" stroke="#2F2F2F" strokeWidth={2} />
                    {/* Phone details */}
                    <Rect x={92} y={24} width={54} height={6} rx={3} fill="#DCDCDC" />
                    <Rect x={92} y={36} width={54} height={6} rx={3} fill="#DCDCDC" />
                    <Rect x={92} y={48} width={54} height={6} rx={3} fill="#DCDCDC" />
                    <Circle cx={119} cy={88} r={16} fill={PURPLE} />

                    {/* Person */}
                    <Circle cx={36} cy={40} r={10} fill="#2F2F2F" />
                    <Rect x={27} y={52} width={18} height={40} rx={6} fill={PURPLE} />
                    <Rect x={18} y={58} width={10} height={6} rx={3} fill={PURPLE} />
                    <Rect x={45} y={58} width={10} height={6} rx={3} fill={PURPLE} />
                    <Rect x={28} y={92} width={6} height={26} rx={3} fill="#2F2F2F" />
                    <Rect x={37} y={92} width={6} height={26} rx={3} fill="#2F2F2F" />
                    <Path d="M28 118 h8 v4 h-10 z" fill="#E25B5B" />
                    <Path d="M37 118 h8 v4 h-10 z" fill="#E25B5B" />
                    <Rect x={20} y={128} width={140} height={3} rx={1.5} fill="#EAEAEA" />
                  </Svg>
                </View>

                {!!err && <Text style={styles.error}>{err}</Text>}

                {/* Inputs */}
                <View style={styles.inputs}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#8C8C8C"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    returnKeyType="next"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor="#8C8C8C"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="done"
                  />
                </View>

                {/* Forgot password */}
                <TouchableOpacity onPress={goToForgotPassword} activeOpacity={0.7}>
                  <Text style={styles.forgot}>Forgot password</Text>
                </TouchableOpacity>

                {/* Login button */}
                <TouchableOpacity style={styles.button} onPress={onLogin} activeOpacity={0.8}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                {/* Bottom link */}
                <View style={styles.bottomRow}>
                  <Text style={[styles.bottomText,{color: colorScheme == "light" ? TEXT_DARK : '#FFFFFF'}]}>Don’t have an account? </Text>
                  <TouchableOpacity onPress={goToRegister} activeOpacity={0.7}>
                    <Text style={styles.linkText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


const PURPLE = '#5B4B8A';
const INPUT_BG = '#E5E5E5';
const TEXT_DARK = '#1E1E1E';

const styles = StyleSheet.create({
  
  flex: { flex: 1 },
  
  scrollContent: {
    flexGrow: 1,
  },

  safe: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1,
    // backgroundColor: 'red'
   },
  topBlobWrapper: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 160, // keep below the blob
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  illustrationWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  inputs: {
    gap: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: INPUT_BG,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: TEXT_DARK,
  },
  forgot: {
    color: PURPLE,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  bottomText: {
    color: '#4A4A4A',
  },
  linkText: {
    color: PURPLE,
    fontWeight: '700',
  },
   error: { color: 'red', marginBottom: 12 }
});
