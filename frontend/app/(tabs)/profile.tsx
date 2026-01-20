
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  Platform,
 
  useColorScheme,
  ScrollView,
  Dimensions,
  PixelRatio,
  Animated,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useAuth } from '../lib/auth/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useThemeColors } from '@/components/themed-view';
import { router } from 'expo-router';

type ListItemProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  danger?: boolean;
  onPress?: () => void;
};

const PURPLE = '#5B4B8A';
const CARD_BG = '#F5F6FA';  // soft grey card
const TEXT_DARK = '#1E1E1E';
const TEXT_MUTED = '#6B6B6B';
const BORDER = '#E9E9EF';
const WHITE = '#FFFFFF';



// Reusable list item
const ListItem: React.FC<ListItemProps> = ({ icon, title, subtitle, right, danger, onPress }) => {
  const colorScheme= useColorScheme();
  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={styles.itemIcon}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.itemTitle,{color: colorScheme == "light" ? TEXT_DARK : '#FFFFFF'}]}>{title}</Text>
          {!!subtitle && <Text style={[[styles.itemSubtitle, danger && styles.dangerText],{color: colorScheme == "light" ? '#6B6B6B' : '#CCCCCC'}]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.itemRight}>
        {right ? right : <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />}
      </View>
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation }: any) {
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const { themeContainerStyle, themeTextStyle, themeCardStyle } = useThemeColors();

  // const colorScheme= useColorScheme();
  const { user,logout } = useAuth();
//  console.log('User in ProfileScreen:', user);
  const onEditProfile = () => {
    // navigate to edit profile screen
    navigation?.navigate?.('EditProfile');
  };
  const insets = useSafeAreaInsets();
    const bottomOffset = insets.bottom || 0;
    const { height: screenH } = Dimensions.get("screen");
    const { height: windowH, width: widthW } = Dimensions.get("window");
    let navBarHeightDp = 0;
  
    if (Platform.OS === "android") {
      const diffPx = Math.max(0, screenH - windowH);
      const ratio = PixelRatio.get();
      navBarHeightDp = Math.round(diffPx / ratio);
    }
  
    const contentPaddingBottom = Math.max(bottomOffset, navBarHeightDp);


  // const onLogout = () => {
  //   // implement your logout logic
  //   console.log('Logout');
  // };

  return (
<>
  <StatusBar style={"light"} translucent />    
        <View style={[styles.overlay, 
          themeContainerStyle
          ]}>
          <View style={[{ height: "91%" }]}>
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: contentPaddingBottom+5 },
              ]}
              showsVerticalScrollIndicator={false}
              stickyHeaderIndices={[0]}
              scrollEventThrottle={16}
            >
              <View style={[styles.headerShadowWrap, 
                themeContainerStyle
                ]}>
                <View style={[styles.header, { minWidth: widthW }]}>
                  {/* Top row: title + search icon (when closed) */}
                  <View style={styles.headerTopRow}>
                    <Text style={[styles.headerTitle]}>Profile</Text>
                    
                      <TouchableOpacity
                        // onPress={openSearch}
                        // style={styles.searchIconButton}
                      >
                        {/* <Ionicons name="search" size={21} color="#ffffff" /> */}
                      </TouchableOpacity>
                    
                  </View>
                  <View style={styles.avatarRow}>
                  <Image source={{ uri: 'https://i.pravatar.cc/100?img=15' }} style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.handle}>{user?.email}</Text>
                  </View>
                  <TouchableOpacity onPress={onEditProfile} style={styles.editBtn} activeOpacity={0.8}>
                    <Feather name="edit-2" size={12} color={WHITE}  />
                  </TouchableOpacity>
                </View>
                </View>
              </View>
              <View style={styles.container}>

                {/* Main Settings Card */}
                <View style={[styles.card, 
                  themeCardStyle
                  ]}>
                  <ListItem
                    icon={<Ionicons name="person-circle-outline" size={20} color={PURPLE} />}
                    title="My Account"
                    subtitle="Make changes to your account"
                    onPress={() => router.push('/profile/myAccount')}
                    // onPress={() => router.replace('./../components/myAccount')}
                  
                  />

                  {/* <View style={styles.divider} /> */}

                  <ListItem
                    icon={<MaterialCommunityIcons name="bank-outline" size={20} color={PURPLE} />}
                    title="Saved Beneficiary"
                    subtitle="Manage your saved account"
                    onPress={() => navigation?.navigate?.('Beneficiaries')}
                  />

                  {/* <View style={styles.divider} /> */}

                  <ListItem
                    icon={<Ionicons name="finger-print-outline" size={20} color={PURPLE} />}
                    title="Face ID / Touch ID"
                    subtitle="Manage your device security"
                    right={
                      <Switch
                        value={faceIdEnabled}
                        onValueChange={setFaceIdEnabled}
                        thumbColor={Platform.OS === 'android' ? WHITE : undefined}
                        trackColor={{ false: '#DADADA', true: '#C9BEEE' }}
                      />
                    }
                  />

                  {/* <View style={styles.divider} /> */}

                  <ListItem
                    icon={<MaterialCommunityIcons name="shield-check-outline" size={20} color={PURPLE} />}
                    title="Two-Factor Authentication"
                    subtitle="Further secure your account for safety"
                    onPress={() => navigation?.navigate?.('TwoFactor')}
                  />

                  {/* <View style={styles.divider} /> */}

                  <ListItem
                    icon={<Ionicons name="exit-outline" size={20} color={PURPLE} />}
                    title="Log out"
                    subtitle="Further secure your account for safety"
                    right={<Ionicons name="chevron-forward" size={20} color="#A0A0A0" />}
                    onPress={logout}
                  />
                </View>

                {/* More Section */}
                <Text style={[styles.sectionLabel,
                  themeTextStyle
                  ]}>More</Text>

                <View style={[styles.card, 
                  themeCardStyle
                  ]}>
                  <ListItem
                    icon={<Ionicons name="help-circle-outline" size={20} color={PURPLE} />}
                    title="Help & Support"
                    onPress={() => navigation?.navigate?.('Help')}
                  />

                  {/* <View style={styles.divider} /> */}

                  <ListItem
                    icon={<Ionicons name="information-circle-outline" size={20} color={PURPLE} />}
                    title="About App"
                    // onPress={logout}
                  />
                </View>
              </View>
            </ScrollView>
          </View>

         </View>
      </>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
  },
    scrollContent: {},
  safe: {
    flex: 1,
    // backgroundColor: WHITE,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 12,
    marginTop: 8,
  },

  topCard: {
    backgroundColor: PURPLE,
    // borderRadius: 14,
    paddingTop: 36,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 14,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 17,
    marginLeft: 7,
    borderWidth: 2,
    borderColor: WHITE,
    backgroundColor: '#EDEDED',
  },
  name: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '700',
  },
  handle: {
    color: '#EDEAF8',
    fontSize: 13,
    marginTop: 2,
  },
  editBtn: {
    backgroundColor: '#483A77',
    width: 25, height: 25,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 55,
    top: 45, 
  },

  card: {
    // backgroundColor: CARD_BG,
   // paddingHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0,
    // borderColor: BORDER,
    marginBottom: 18,
    shadowColor: "rgba(30, 2, 57, 1)",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginLeft: 44, // leave icon area untouched
    opacity: 0.6,
  },

  item: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  itemIcon: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  itemTitle: {
   
    fontWeight: '700',
    fontSize: 15,
  },
  itemSubtitle: {
    color: TEXT_MUTED,
    fontSize: 12.5,
    marginTop: 2,
  },
  itemRight: {
    paddingLeft: 8,
  },
  dangerText: {
    color: '#D9534F',
  },
  header: {
    paddingTop: 50,
    backgroundColor: "rgba(30, 2, 57, 1)",
    paddingBottom: 18,
    paddingHorizontal: 15,
  },
  headerShadowWrap: {
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    zIndex: 1000,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  headerTitle: {
    paddingHorizontal: 20,
    
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    // marginTop: 10,
  },
  sectionLabel: {
    color: TEXT_MUTED,
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
});
