
// // app/(auth)/register.tsx
// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
// import { Link } from 'expo-router';
// import { useAuth } from './../lib/auth/AuthContext';

// export default function Register() {
//   const { register } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async () => {
//     setErr(null);
//     setLoading(true);
//     try {
//       await register(email.trim(), password);
//     } catch (e: any) {
//       setErr(e.message ?? 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create your account</Text>
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
//       <Button title={loading ? 'Creating...' : 'Register'} onPress={onSubmit} disabled={loading} />
//       <View style={{ height: 16 }} />
     
//       <Link href="/(auth)/login">Back to Login</Link>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
//   input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
//   error: { color: 'red', marginBottom: 12 }
// });




import { router } from 'expo-router';
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
  Keyboard,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useAuth } from '../lib/auth/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
  const colorScheme= useColorScheme();
   const insets = useSafeAreaInsets();

  const onRegister = async () => {
    // TODO: add your register logic here
    // console.log({ email, password });
setErr(null);
    setLoading(true);
    try {
      await register(email.trim(), password, fullName);
    } catch (e: any) {
      setErr(e.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
    // console.log({ fullName, email, password, confirm });
  };


  const goToSignIn = () => {
    // If you have a SignIn screen wired in your navigator:
     router.push("/login"); // OR "../register"
    // Otherwise just stub:
    // console.log('Go to Sign In');
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
        {/* Top decorative blob/circles */}
        <View style={styles.topBlobWrapper}>
          <Svg width="100%" height="140">
            {/* Large top-left circle */}
            <Circle cx={-30} cy={-20} r={120} fill="#5B4B8A" />
            {/* Overlapping smaller circle */}
            <Circle cx={110} cy={10} r={75} fill="#5B4B8A" />
          </Svg>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title,,{color: colorScheme == "light" ? TEXT_DARK : '#FFFFFF'}]}>Welcome Onboard!</Text>
          <Text style={styles.subtitle}>Lets help you meet your task</Text>

          <View style={styles.inputs}>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#8C8C8C"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#8C8C8C"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#8C8C8C"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#8C8C8C"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={onRegister} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <Text style={[styles.bottomText,,{color: colorScheme == "light" ? TEXT_DARK : '#FFFFFF'}]}>Already have an account? </Text>
            <TouchableOpacity onPress={goToSignIn} activeOpacity={0.7}>
              <Text style={styles.linkText}>Sign In</Text>
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
  safe: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
    flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
  },
  container: { flex: 1 },
  topBlobWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // Let SVG overflow to create the curved look at the top
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 160, // push below the top blob
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8C8C8C',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputs: {
    gap: 14,
    marginBottom: 24,
  },
  input: {
    backgroundColor: INPUT_BG,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: TEXT_DARK,
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
});
