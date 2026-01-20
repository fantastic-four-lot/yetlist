
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  useColorScheme,
} from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useColorScheme } from 'react-native';

const PURPLE = '#5B4B8A';
const TEXT_DARK = '#1E1E1E';

export default function OnboardingScreen({ navigation }: any) {

    const colorScheme= useColorScheme();
  const onGetStarted = async () => {
    try {
      await AsyncStorage.setItem('@has_seen_onboarding', 'true');
      router.replace('/(auth)/login') // or 'Register'
    } catch (e) {
      // ignore and continue
    }
  };

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        {/* Top decorative overlapping circles */}
        <View style={styles.topBlobWrapper}>
          <Svg width="100%" height="140">
            <Circle cx={-30} cy={-20} r={120} fill={PURPLE} />
            <Circle cx={110} cy={10} r={75} fill={PURPLE} />
          </Svg>
        </View>

        <View style={styles.content}>
          {/* Illustration: phone + person */}
          <View style={styles.illustrationWrapper}>
           <Image
               source={require('../../assets/images/port-welcome.png')}
               style={styles.illustration}
               resizeMode="contain"
             />
          </View>

          {/* Text block */}
          <Text style={[styles.header,{color: colorScheme == "light" ? TEXT_DARK : '#FFFFFF'}]}>A Smarter Way to Remember</Text>
          <Text style={[  styles.desc,{color: colorScheme == "light" ? '#6B6B6B' : '#CCCCCC'}]}>
            Whether it’s drinking water, paying bills, booking tickets, or taking medicines — your reminder
            buddy keeps track of it all.{'\n'}Relax… we’ll remind you at the right time.
          </Text>

          {/* CTA */}
          <TouchableOpacity style={styles.button} onPress={onGetStarted} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
    // backgroundColor: 'red',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1
    
   },
  topBlobWrapper: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 160,
  },
  illustrationWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  illustration: {
    margin: 10,
    width: 250,
    height: 250,
  },
  header: {
    fontSize: 20,
    fontWeight: '800',
    // color: TEXT_DARK,
    marginBottom: 15,
  },
  desc: {
    color: '#6B6B6B',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 26,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop:0
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
``
