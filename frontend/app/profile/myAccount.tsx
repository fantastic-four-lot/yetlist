
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
  Alert
  
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useThemeColors } from '@/components/themed-view';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../lib/auth/AuthContext';
import { api } from '../lib/auth/api';


export default function MyAccountScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('UI UX DESIGN');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 93123135');
  const [website, setWebsite] = useState('www.gfx.com');
  const [password, setPassword] = useState('••••••••');
  const { themeContainerStyle, themeTextStyle, themeCardStyle } = useThemeColors();
  const colorScheme= useColorScheme();
  const { user,logout,handleLogout } = useAuth();

  





 useEffect(() => {

  const getUserData = async () => {
    const userData = await api.get('auth/me').then(res => res.data);
    setEmail(userData.email);
    setName(userData.name);
  };

  getUserData();
}, []);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled) {
      setAvatarUri(res.assets[0]?.uri ?? null);
    }
  };


  return (
    <>
      <StatusBar translucent />    

    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // Offset equals top inset (status bar/safe area) + any fixed header height
        
        // keyboardVerticalOffset={Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.push('/profile')}>
                <Ionicons name="chevron-back" size={24} color={themeTextStyle.color} />
              </TouchableOpacity>
                <Text style={[ themeTextStyle]}>My Account</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Ionicons name="settings-outline" size={22} color={themeTextStyle.color} />
              </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={[styles.card, themeCardStyle]}>
              <View style={styles.avatarWrap}>
                {/* <Image
                  source={
                    avatarUri
                      ? { uri: avatarUri }
                      : require('../../assets/avatar-placeholder.png')
                  }
                  style={styles.avatar}
                /> */}
                <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />

                <TouchableOpacity onPress={pickAvatar} style={styles.editBadge}>
                  <Feather name="edit-2" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text style={[styles.name, themeTextStyle]}>{user?.name}</Text>
                <Text style={[styles.subtitle,themeTextStyle]}>{subtitle}</Text>
              </View>
            </View>

            {/* Form */}
            <View style={[styles.card, themeCardStyle]}>
              {renderField('Name', name, setName, 'person-outline', false, { themeTextStyle,  })}
              {renderField('Your Email', email, setEmail, 'mail-outline',false, { themeTextStyle,  })}
              {renderField('Phone Number', phone, setPhone, 'call-outline', false, { themeTextStyle })}
              {/* {renderField('Password', password, setPassword, 'lock-closed-outline', true, { themeTextStyle })} */}
            </View>

            {/* Logout */}
            <View style={{ paddingHorizontal: 4 }}>
              <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn,{backgroundColor: colorScheme == "light" ? "#483A77" :'#483A77'}]}>
                <Text style={[styles.logoutText,{color: colorScheme == "light" ? "#FFFFFF" : '#FFFFFF'}]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
  );
}


type RenderCtx = {
  themeTextStyle?: any;
  palette?: {
    text?: string;
    muted?: string;
    border?: string;
  };
};

const renderField = (
  label: string,
  value: string,
  onChangeText: (t: string) => void,
  iconName: string,
  secure?: boolean,
  ctx?: RenderCtx
) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={[styles.label, ctx?.themeTextStyle]}>{label}</Text>

    <View style={[styles.inputRow, { borderColor: ctx?.palette?.border ?? '#E6E6EA', backgroundColor: '#FFFFFF' }]}>
      <Ionicons
        name={iconName as any}
        size={18}
        color={ctx?.palette?.muted ?? '#6B6B6B'}
        style={{ marginRight: 8 }}
      />
      <TextInput
        style={[styles.input, { color: ctx?.palette?.text ?? '#1E1E1E' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={ctx?.palette?.muted ?? '#6B6B6B'}
        secureTextEntry={secure}
      />
    </View>
  </View>
);


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  card: {
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderWidth: 0,
    // borderColor: BORDER,
    
    marginBottom: 18,
    shadowColor: "rgba(30, 2, 57, 1)",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#E0E0E0',
  },
  editBadge: {
    position: 'absolute',
    right: '35%',
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#483A77',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#6B6B6B',
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1E1E1E',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6EA',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E1E1E',
  },
  logoutBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 0,
    // borderColor: "rgba(30, 2, 57, 1)",
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    // color: "rgba(30, 2, 57, 1)",
    fontWeight: '700',
  },
});
``
