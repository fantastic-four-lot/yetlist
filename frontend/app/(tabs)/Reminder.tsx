import ThemeColors from "@/components/themed-view";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  UIManager,
  View,
  Easing,                                                           
} from "react-native";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FloatingSearch } from "@/components/FloatingSearch";
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme'; // you already use something similar

const BG_URI =
  "https://images.unsplash.com/photo-1591121432666-6cb433b6dd2d?fm=jpg&w=1080";

const reminders = [
  {
    icon: "calendar",
    title: "Team Standup Meeting",
    time: "Today, 10:00 AM",
    location: "Zoom",
    priority: "high",
    color: "#f97373",
  },
  {
    icon: "users",
    title: "Coffee with Sarah",
    time: "Today, 3:00 PM",
    location: "Starbucks Downtown",
    priority: "medium",
    color: "#f59e0b",
  },
  {
    icon: "bell",
    title: "Take Vitamins",
    time: "Daily, 8:00 PM",
    location: "Home",
    priority: "low",
    color: "#22c55e",
  },
  {
    icon: "calendar",
    title: "Project Deadline",
    time: "Tomorrow, 5:00 PM",
    location: "Work",
    priority: "high",
    color: "#a855f7",
  },
  {
    icon: "map-pin",
    title: "Dentist Appointment",
    time: "Wed, 2:00 PM",
    location: "Main Street Clinic",
    priority: "medium",
    color: "#38bdf8",
  },
  {
    icon: "map-pin",
    title: "Dentist Appointment1",
    time: "Wed, 2:00 PM",
    location: "Main Street Clinic",
    priority: "medium",
    color: "#38bdf8",
  },
  {
    icon: "map-pin",
    title: "Dentist Appointment2",
    time: "Wed, 2:00 PM",
    location: "Main Street Clinic",
    priority: "medium",
    color: "#38bdf8",
  },
  {
    icon: "map-pin",
    title: "Dentist Appointment3",
    time: "Wed, 2:00 PM",
    location: "Main Street Clinic",
    priority: "medium",
    color: "#38bdf8",
  },
] as const;

import type { ComponentProps } from "react";
import { router } from "expo-router";

// Extract valid Feather `name` type
type FeatherName = ComponentProps<typeof Feather>["name"];

// const MODULES: { title: string; icon: FeatherName }[] = [
//   { title: "Lifestyle & Daily Essentials", icon: "shopping-bag" },
//   { title: "Health & Wellness", icon: "heart" },
//   { title: "Travel & Planning", icon: "map" },
//   { title: "Work, Studies", icon: "briefcase" },
//   { title: "Events & Celebrations", icon: "gift" },
//   { title: "Notes, Credentials", icon: "edit" },
// ];

const MODULES: { title: string; icon: FeatherName; screen:string | null }[] = [
  { title: "Lifestyle & Daily Essentials", icon: "shopping-bag", screen: null },
  { title: "Health & Wellness", icon: "heart", screen: null },
  { title: "Travel & Planning", icon: "map", screen: "/reminder/TravelPlanning" },
  { title: "Work, Studies", icon: "briefcase", screen: null },
  { title: "Events & Celebrations", icon: "gift", screen: null },
  { title: "Notes, Credentials", icon: "edit", screen: null },
];


const SUBTITLES = [
  "🔔 Never miss what matters most",
  "📅 Stay on top of your day effortlessly",
  "✨ Tiny reminders, big impact on life",
  "🧠 Your second brain for daily priorities",
];


// if (
//   Platform.OS === "android" &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const RemindersTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBar, setSearchBar] = useState(false); // false = collapsed, true = open input
  const [showModules, setShowModules] = useState(false);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [compactStats, setCompactStats] = useState(false);
  const colorScheme = useColorScheme();

  const moduleContainerAnim = useRef(new Animated.Value(0)).current;
  const moduleItemAnims = useRef(MODULES.map(() => new Animated.Value(0))).current;

  // console.log("Safe area insets:");
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

  const filteredData = reminders.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Animated subtitle ---
  const subtitleOpacity = useRef(new Animated.Value(1)).current;
  const subtitleTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateChange = () => {
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 8,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
        subtitleTranslateY.setValue(-8);
        Animated.parallel([
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(subtitleTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    const id = setInterval(animateChange, 10000);
    return () => clearInterval(id);
  }, [subtitleOpacity, subtitleTranslateY]);

  const { themeContainerStyle, themeTextStyle, themeCardStyle } = ThemeColors();

  const renderPriorityBadge = (priority: string) => {
    if (priority === "high") {
      return (
        <Badge
          label="High"
          backgroundColor="rgba(248,113,113,0.15)"
          borderColor="rgba(248,113,113,0.5)"
          textColor="#fca5a5"
        />
      );
    }
    if (priority === "medium") {
      return (
        <Badge
          label="Medium"
          backgroundColor="rgba(245,158,11,0.15)"
          borderColor="rgba(245,158,11,0.5)"
          textColor="#fed7aa"
        />
      );
    }
    return (
      <Badge
        label="Low"
        backgroundColor="rgba(107,114,128,0.2)"
        borderColor="rgba(107,114,128,0.6)"
        textColor="#e5e7eb"
      />
    );
  };
// --- Module animations ---
 const rotation = useRef(new Animated.Value(0)).current;

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"], // 0 = plus, 45deg = looks like close
  });

  const openModules = () => {
  // make sure it's mounted
  setShowModules(true);

  // reset all anim values
  moduleContainerAnim.setValue(0);
  moduleItemAnims.forEach(a => a.setValue(0));

  Animated.parallel([
    Animated.timing(backdropOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(moduleContainerAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(rotation, {
      toValue:  1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.stagger(
      50,
      moduleItemAnims
        .slice()
        .reverse()
        .map(anim =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          })
        )
    ),
  ]).start();
};

const closeModules = () => {
  Animated.parallel([
    Animated.timing(backdropOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(moduleContainerAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(rotation, {
      toValue:  0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
     Animated.stagger(
      20,
      moduleItemAnims
        .map(anim =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      )
    ),
  ]).start(({ finished }) => {
    if (finished) {
      // hide only AFTER animation completes
      setShowModules(false);
    }
  });
};

const handleFabPress = () => {
  if (!showModules) {
    openModules();
  } else {
    closeModules();
  }
};

  const navigation = useNavigation();

  // const handleModulePress = (item: typeof MODULES[number]) => {
  //     if (item.screen) {
  //       navigation.navigate(item.screen as never);
  //       return;
  //     }}
  const handleModulePress = (item: typeof MODULES[number]) => {
  if (item.screen) {
    closeModules();
    router.push(item.screen as any);
  }
};


  // --- Search bar animation (width) ---
  const widthAnim = useRef(new Animated.Value(40)).current;

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const openSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchBar(true);
    Animated.timing(widthAnim, {
      toValue: widthW - 30,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const closeSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchBar(false);
    setSearchQuery("");
    Animated.timing(widthAnim, {
      toValue: 40,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <>
      <StatusBar style={"light"} translucent />    
      <View style={[styles.overlay, themeContainerStyle]}>
        <View style={[{ height: "91%" }]}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: contentPaddingBottom+5 },
            ]}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const y = e.nativeEvent.contentOffset.y;
              const shouldCompact = y > 40;
              if (shouldCompact !== compactStats) {
                setCompactStats(shouldCompact);
              }
            }}
          >
            <View style={[styles.headerShadowWrap, themeContainerStyle]}>
              <View style={[styles.header, { minWidth: widthW }]}>
                {/* Top row: title + search icon (when closed) */}
                <View style={styles.headerTopRow}>
                  <Text style={[styles.headerTitle]}>Reminders</Text>
                  {!searchBar && (
                    <TouchableOpacity
                      onPress={openSearch}
                      style={styles.searchIconButton}
                    >
                      <Ionicons name="search" size={21} color="#ffffff" />
                    </TouchableOpacity>
                  )}
                </View>

                <Animated.Text
                  style={[
                    {
                      opacity: subtitleOpacity,
                      transform: [{ translateY: subtitleTranslateY }],
                    },
                    { paddingBottom: !searchBar ? 20 : 16 },
                    styles.headerSubtitle,
                  ]}
                >
                  {SUBTITLES[subtitleIndex]}
                </Animated.Text>

                {/* Search bar inline (no absolute positioning) */}
                {searchBar && (
                  <Animated.View
                    style={[styles.searchContainer, { width: widthAnim }]}
                  >
                    <Ionicons
                      name="search"
                      size={21}
                      color="#fff"
                      style={{ marginLeft: 10 }}
                    />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search"
                      placeholderTextColor="#eee3fa"
                      value={searchQuery}
                      onChangeText={handleSearchChange}
                      autoFocus
                    />
                    <TouchableOpacity onPress={closeSearch}>
                      <Ionicons
                        name="close"
                        size={22}
                        color="#fff"
                        style={{ marginRight: 10 }}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                )}

                {/* Quick stats row – shrinks when search is open */}
                <View
                  style={[
                    styles.quickStatsRow,
                    (compactStats || searchBar) &&
                      styles.quickStatsRowCollapsed,
                  ]}
                >
                  <Card
                    style={[
                      styles.quickStatCard,
                      styles.quickStatDanger,
                      (compactStats || searchBar) &&
                        styles.quickStatCardCompact,
                    ]}
                  >
                    <View
                      style={[
                        styles.quickStatInner,
                        (compactStats || searchBar) &&
                          styles.quickStatInnerCompact,
                      ]}
                    >
                      <Text style={styles.quickStatValue}>2</Text>
                      <Text style={styles.quickStatLabel}>Urgent</Text>
                    </View>
                  </Card>

                  <Card
                    style={[
                      styles.quickStatCard,
                      styles.quickStatInfo,
                      (compactStats || searchBar) &&
                        styles.quickStatCardCompact,
                    ]}
                  >
                    <View
                      style={[
                        styles.quickStatInner,
                        (compactStats || searchBar) &&
                          styles.quickStatInnerCompact,
                      ]}
                    >
                      <Text style={styles.quickStatValue}>3</Text>
                      <Text style={styles.quickStatLabel}>Today</Text>
                    </View>
                  </Card>

                  <Card
                    style={[
                      styles.quickStatCard,
                      styles.quickStatPrimary,
                      (compactStats || searchBar) &&
                        styles.quickStatCardCompact,
                    ]}
                  >
                    <View
                      style={[
                        styles.quickStatInner,
                        (compactStats || searchBar) &&
                          styles.quickStatInnerCompact,
                      ]}
                    >
                      <Text style={styles.quickStatValue}>8</Text>
                      <Text style={styles.quickStatLabel}>Total</Text>
                    </View>
                  </Card>
                </View>
              </View>
            </View>

            {/* Reminder list */}
            <View style={styles.listWrapper}>
              {filteredData.map((reminder) => (
                <Card
                  key={reminder.title}
                  style={[styles.reminderCard, themeCardStyle]}
                >
                  <View style={styles.reminderRow}>
                    <View style={styles.reminderIconCol}>
                      <View
                        style={[
                          styles.reminderIconWrap,
                          { backgroundColor: `${reminder.color}33` },
                        ]}
                      >
                        <Feather
                          name={reminder.icon as any}
                          size={22}
                          color={themeTextStyle.color}
                        />
                      </View>
                    </View>
                    <View style={styles.reminderContent}>
                      <View style={styles.reminderHeaderRow}>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[styles.reminderTitle, themeTextStyle]}
                          >
                            {reminder.title}
                          </Text>
                          <Text style={styles.reminderMeta}>
                            {reminder.time} • {reminder.location}
                          </Text>
                        </View>
                        {renderPriorityBadge(reminder.priority)}
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Modules popping above FAB */}
        <AnimatedPressable
          pointerEvents={showModules ? "auto" : "none"}
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: backdropOpacity,                     // 0 -> 1
              backgroundColor: "rgba(0, 0, 0, 0.59)",
            },
          ]}
          onPress={() => {
            // console.log("Module backdrop pressed");
            closeModules();
          }}
        />

         

        {showModules && (
          <Animated.View
            style={[
              styles.modulesFabContainer,
              {
                // backgroundColor:"red",
                bottom: bottomOffset + 100 + 76,
                right: 12,
                zIndex: 1002,
                opacity: moduleContainerAnim,
                transform: [
                  {
                    translateY: moduleContainerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0], // slide up a bit from FAB area
                    }),
                  },
                ],
              },
            ]}
          >
            <AnimatedPressable
          pointerEvents={showModules ? "auto" : "none"}
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: backdropOpacity, 
            },
          ]}
          onPress={() => {
            // console.log("Module backdrop pressed");
            closeModules();
          }}
        />
            {MODULES.map((item, index) => {
              const itemOpacity = moduleItemAnims[index];
              const itemTranslateY = moduleItemAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0], // come from slightly below
              });
              const itemScale = moduleItemAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1], // little pop
              });

              return (
                <Animated.View
                  key={item.title}
                  style={[
                    styles.moduleBubble1,
                    {
                      opacity: itemOpacity,
                      transform: [{ translateY: itemTranslateY }, { scale: itemScale }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.moduleBubble}
                    activeOpacity={0.9}
                    onPress={() => handleModulePress(item)}>
                    <Text style={styles.moduleBubbleText}>{item.title}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.moduleBubbleIcon}
                    activeOpacity={0.9}
                    onPress={() => handleModulePress(item)}
                  >
                    <Feather name={item.icon} size={26} color="#d7d9deff" />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}



        {/* FAB */}
        <TouchableOpacity
          style={[styles.fab, { bottom: bottomOffset + 100, zIndex: 1003 }]}
          // activeOpacity={0.1}
          onPress={handleFabPress}
        >
          {/* {showModules ? <Ionicons name="close" size={28} color="#fff" />:
          <Ionicons name="add" size={28} color="#fff" />} */}
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <Ionicons name="add" size={28} color="#fff" />
            </Animated.View>
        </TouchableOpacity>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    backgroundColor: "#4e12c6ff",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    zIndex: 1003,
    
  },
  backdrop: {
  ...StyleSheet.absoluteFillObject,
  zIndex: 1000,
},

  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  scrollContent: {},
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
  },
  headerTitle: {
    paddingHorizontal: 20,
    
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    // marginTop: 10,
  },
  headerSubtitle: {
    // backgroundColor: "white",
    fontSize: 14,
    color: "#babec2ff",
    marginTop: 5,
    paddingLeft: 10,
  },
  searchIconButton: {
    padding: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  searchContainer: {
    borderColor: "rgba(0, 0, 0, 0.25)",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#786e86eb",
    borderRadius: 30,
    height: 40,
    shadowColor: "#000000ff",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    paddingHorizontal: 8,
    alignSelf: "flex-end",
    // marginRight: 20,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    height: 60,
    marginLeft: 8,
  },

  // Modules above FAB
  modulesFabContainer: {
    position: "absolute",
    alignItems: "flex-end",
    gap: 8,
    
  },
  moduleBubble1:{
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  moduleBubble: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#301860ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moduleBubbleIcon: {
  borderRadius: 999,
  paddingVertical: 13,
  paddingHorizontal: 14,
  backgroundColor: "#3e1d81ff",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  },
  moduleBubbleText: {
    fontSize: 14,
    color: "#e5e7eb",
  },

  // Quick stats
  quickStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    // marginTop: 8,
  },
  quickStatsRowCollapsed: {
    transform: [{ scaleY: 1 }],
    marginTop: 8,
  },
  quickStatCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  quickStatCardCompact: {
    paddingVertical: 10,
  },
  quickStatInner: {
    alignItems: "center",
  },
  quickStatInnerCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f9fafb",
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  quickStatDanger: {
    backgroundColor: "rgba(248,113,113,0.18)",
    borderColor: "rgba(248,113,113,0.6)",
  },
  quickStatInfo: {
    backgroundColor: "rgba(9, 70, 169, 0.18)",
    borderColor: "rgba(59,130,246,0.6)",
  },
  quickStatPrimary: {
    backgroundColor: "rgba(168,85,247,0.18)",
    borderColor: "rgba(168,85,247,0.6)",
  },

  listWrapper: {
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  reminderCard: {
    paddingVertical: 5,
    paddingHorizontal: 3,
    borderWidth: 0,
    shadowColor: "rgba(30, 2, 57, 1)",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    gap: 12,
  },
  reminderIconCol: {
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
  },
  reminderContent: {
    flex: 1,
  },
  reminderHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  reminderMeta: {
    fontSize: 12,
    color: "#9cafa1ff",
  },
});

export default RemindersTab;

