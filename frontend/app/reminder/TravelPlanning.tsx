// TravelPlanningScreen.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Easing,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useThemeColors } from '@/components/themed-view';
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Dimensions,
  LayoutAnimation,
  PixelRatio,
  Platform,
  TextInput,
  Pressable,
  UIManager,
                                                           
} from "react-native";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FloatingSearch } from "@/components/FloatingSearch";
import { useColorScheme } from '@/hooks/use-color-scheme'; 
import { AddLeaveBottomSheet } from "@/components/AddLeaveBottomSheet";

// ---------- Types (aligned with backend) ----------

export type ReminderCategory = "travel";

export type TravelSubType = "leave_plan" | "trip" | "ticket_to_book" | "holiday";

export interface TravelLeaveEntry {
  leaveDate: string; // YYYY-MM-DD
  leaveType: "CL" | "SL" | "PL" | "WFH" | "OTHER";
  partOfDay: "full" | "1st half" | "2nd half";
  reason?: string;
  remainder_msg:string;
  remindAt?: string[]; 
  notify?:boolean;
}

export interface TravelTrip {
  tripId: string;
  destination: string;
  fromDate: string;
  toDate: string;
  travelers: string[];
  budget?: number;
  transport: Array<{
    mode: "bus" | "train" | "flight" | "car" | "other";
    from: string;
    to: string;
    departureAt: string;
    arrivalAt?: string;
    pnrOrBookingId?: string;
    provider?: string;
    status: "to_book" | "booked" | "cancelled";
    remindAt?: string[];
  }>;
  stay: Array<{
    hotelName: string;
    address?: string;
    checkIn: string;
    checkOut: string;
    bookingId?: string;
    status: "to_book" | "booked" | "cancelled";
    remindAt?: string[];
  }>;
  checklist: Array<{ item: string; done: boolean }>;
}

export interface TravelTicketToBook {
  ticketId: string;
  mode: "bus" | "train" | "flight";
  from: string;
  to: string;
  travelDate: string;
  preferredTimeRange: "morning" | "afternoon" | "evening" | "night";
  platform: string;
  priceLimit?: number;
  remindAt: string[];
}

export interface TravelHoliday {
  id: string;
  title: string;
  date: string;
  notes?: string;
}

export interface Reminder<TDetails = any> {
  id: string;
  userId: string;
  category: ReminderCategory;
  subType: TravelSubType;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  remindAt: string[];
  repeatRule?: string;
  status: "pending" | "done" | "skipped";
  priority?: "low" | "medium" | "high";
  details: TDetails;
}

// ---------- Dummy data (replace with API later) ----------

const dummyLeaveEntries: TravelLeaveEntry[] = [
  {
    leaveDate: "2025-03-11",
    leaveType: "CL",
    partOfDay: "full",
    reason: "Family function",
    remainder_msg: "approved",
    remindAt: ["2021-02-14T20:00:00.000Z"],
    notify: true,
  },
  {
    leaveDate: "2025-07-01",
    leaveType: "WFH",
    partOfDay: "1st half",
    reason: "Delivery expected",
    remainder_msg: "pending",
    remindAt: ["2022-04-30T21:00:00.000Z"]
  },
  {
    leaveDate: "2025-03-13",
    leaveType: "CL",
    partOfDay: "full",
    reason: "Family function",
    remainder_msg: "rejected",
    remindAt:[ "2024-03-14T20:00:00.000Z"]
  },
  {
    leaveDate: "2025-07:02".replace(":", "-"),
    leaveType: "WFH",
    partOfDay: "1st half",
    reason: "Delivery expected",
    remainder_msg: "pending",
    remindAt: ["2023-05-30T21:00:00.000Z"]
  },
  {
    leaveDate: "2025-03-18",
    leaveType: "CL",
    partOfDay: "full",
    reason: "Family function",
    remainder_msg: "approved",
    remindAt: ["2026-03-14T20:00:00.000Z"]
  },
  {
    leaveDate: "2025-07:09",
    leaveType: "WFH",
    partOfDay: "1st half",
    reason: "Delivery expected",
    remainder_msg: "pending",
    remindAt: ["2023-05-30T21:00:00.000Z"]
  },

];

const dummyTrip: TravelTrip = {
  tripId: "trip_goa_2025",
  destination: "Goa",
  fromDate: "2025-08-10",
  toDate: "2025-08-15",
  travelers: ["Neufer", "Alex"],
  budget: 25000,
  transport: [
    {
      mode: "flight",
      from: "BLR",
      to: "GOI",
      departureAt: "2025-08-10T06:30:00.000Z",
      arrivalAt: "2025-08-10T08:00:00.000Z",
      pnrOrBookingId: "ABCD1234",
      provider: "IndiGo",
      status: "booked",
      remindAt: ["2025-08-10T02:30:00.000Z", "2025-08-10T05:30:00.000Z"],
    },
  ],
  stay: [
    {
      hotelName: "Beachside Resort",
      address: "Calangute, Goa",
      checkIn: "2025-08-10T12:00:00.000Z",
      checkOut: "2025-08-15T11:00:00.000Z",
      bookingId: "HOTEL5678",
      status: "booked",
      remindAt: ["2025-08-10T09:00:00.000Z"],
    },
  ],
  checklist: [
    { item: "Sunscreen", done: false },
    { item: "Power bank", done: true },
    { item: "Beach shorts", done: false },
  ],
};

const dummyTicketsToBook: TravelTicketToBook[] = [
  {
    ticketId: "t1",
    mode: "train",
    from: "Bangalore",
    to: "Chennai",
    travelDate: "2025-02-20",
    preferredTimeRange: "night",
    platform: "IRCTC",
    priceLimit: 1500,
    remindAt: ["2025-01-20T09:00:00.000Z", "2025-02-10T09:00:00.000Z"],
  },
  {
    ticketId: "t2",
    mode: "bus",
    from: "Bangalore",
    to: "Coorg",
    travelDate: "2025-03-05",
    preferredTimeRange: "evening",
    platform: "RedBus",
    priceLimit: 800,
    remindAt: ["2025-02-25T08:00:00.000Z"],
  },
];

const dummyHolidays: TravelHoliday[] = [
  {
    id: "h1",
    title: "Long weekend – Independence Day",
    date: "2025-08-15",
    notes: "Plan short trip around Thursday–Sunday",
  },
  {
    id: "h2",
    title: "Diwali break",
    date: "2025-10-20",
    notes: "Visit hometown, 3–4 days",
  },
];



// ---------- Simple backend helper (plug your Express here) ----------

async function saveReminder<TDetails>(
  reminder: Reminder<TDetails>
): Promise<void> {
  try {
    await fetch("http://localhost:3000/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reminder),
    });
    // handle response / toast in real app
  } catch (err) {
    console.warn("Failed to save reminder", err);
  }
}

// Helper to build payload for leave plan
function buildLeavePlanReminder(
  userId: string,
  leaves: TravelLeaveEntry[]
): Reminder<{ leaves: TravelLeaveEntry[] }> {
  return {
    id: `rem_leave_${Date.now()}`,
    userId,
    category: "travel",
    subType: "leave_plan",
    title: "Yearly Leave Plan",
    description: "All planned leaves & WFH days",
    startAt: new Date().toISOString(),
    remindAt: [], // you can compute global reminders here
    status: "pending",
    details: {
      leaves,
    },
  };
}



// ---------- UI Components ----------

type TabKey = "leaves" | "trips" | "tickets" | "holidays";

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] =
  [
    { key: "leaves", label: "Leaves", icon: "calendar" },
    { key: "trips", label: "Trips", icon: "airplane" },
    { key: "tickets", label: "Tickets", icon: "train" },
    { key: "holidays", label: "Holidays", icon: "sunny" },
  ];
  const SUBTITLES = [
  "🔔 Never miss what matters most",
  "📅 Stay on top of your day effortlessly",
  "✨ Tiny reminders, big impact on life",
  "🧠 Your second brain for daily priorities",
];

export const TravelPlanningScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("leaves");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBar, setSearchBar] = useState(false); // false = collapsed, true = open input
  const [showModules, setShowModules] = useState([]);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [compactStats, setCompactStats] = useState(false);
  const colorScheme = useColorScheme();
  
    // const filteredData = showModules.filter((item) =>
    //   item.title.toLowerCase().includes(searchQuery.toLowerCase())
    // );
     const { themeContainerStyle, themeTextStyle, themeCardStyle } =
    useThemeColors();
  
    // --- Animated subtitle ---
    const subtitleOpacity = useRef(new Animated.Value(1)).current;
    const subtitleTranslateY = useRef(new Animated.Value(0)).current;

  

  const handleTabPress = (key: TabKey) => {
    // reset animation
    fadeAnim.setValue(0);
    translateYAnim.setValue(20);
    setActiveTab(key);
  };

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "leaves":
        setShowModules(dummyLeaveEntries)
        return (
          <LeavesView
            leaves={dummyLeaveEntries}
            onSave={async () => {
              const payload = buildLeavePlanReminder("user_1", dummyLeaveEntries);
              await saveReminder(payload);
            }}
            theme={{
            container: themeContainerStyle,
            text: themeTextStyle,
            card: themeCardStyle,
          }}
          />
        );
      case "trips":
        setShowModules([dummyTrip])
        return <TripsView trip={dummyTrip}
        theme={{
            container: themeContainerStyle,
            text: themeTextStyle,
            card: themeCardStyle,
          }} />;
      case "tickets":
        setShowModules(dummyTicketsToBook)
        return <TicketsView tickets={dummyTicketsToBook}
        theme={{
            container: themeContainerStyle,
            text: themeTextStyle,
            card: themeCardStyle,
          }} />;
      case "holidays":
        setShowModules(dummyHolidays)
        return <HolidaysView holidays={dummyHolidays}
        theme={{
            container: themeContainerStyle,
            text: themeTextStyle,
            card: themeCardStyle,
          }} />;
      default:
        return null;
    }
  }, [activeTab]);

    
  
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

  const rotation = useRef(new Animated.Value(0)).current;
  
    const rotateInterpolate = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "45deg"], // 0 = plus, 45deg = looks like close
    });

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
    // <>
    // <StatusBar translucent />
    // <View style={styles.safe}>
    //   <View style={styles.container}>
    //     <View style={styles.headerRow}>
    //       <View>
    //         {/* <Text style={styles.title}>Travel & Planning</Text> */}
    //         <Text style={styles.subtitle}>
    //           Manage your leaves, trips & tickets in one place.
    //         </Text>
    //       </View>
    //       <View style={styles.headerIconCircle}>
    //         <Ionicons name="map" size={26} color="#fff" />
    //       </View>
    //     </View>

    //     {/* Tabs */}
    //     <View style={styles.tabRow}>
    //       {TABS.map((tab) => {
    //         const active = tab.key === activeTab;
    //         return (
    //           <TouchableOpacity
    //             key={tab.key}
    //             style={[styles.tabChip, active && styles.tabChipActive]}
    //             onPress={() => handleTabPress(tab.key)}
    //             activeOpacity={0.8}
    //           >
    //             <Ionicons
    //               name={tab.icon}
    //               size={18}
    //               color={active ? "#0f172a" : "#1f406dff"}
    //               style={{ marginRight: 6 }}
    //             />
    //             <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
    //               {tab.label}
    //             </Text>
    //           </TouchableOpacity>
    //         );
    //       })}
    //     </View>

    //     {/* Content with animation */}
    //     <Animated.View
    //       style={{
    //         flex: 1,
    //         opacity: fadeAnim,
    //         transform: [{ translateY: translateYAnim }],
    //       }}
    //     >
    //       {renderContent}
    //     </Animated.View>
    //   </View>
    // </View>
    // </>
    <>
      <StatusBar translucent style="light"/>    
      <View style={[styles.overlay]}>
        <View 
        // style={[{backgroundColor:"blue"}]}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: contentPaddingBottom+5},
            ]}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]}
            scrollEventThrottle={16}
            // onScroll={(e) => {
            //   const y = e.nativeEvent.contentOffset.y;
            //   const shouldCompact = y > 40;
            //   if (shouldCompact !== compactStats) {
            //     setCompactStats(shouldCompact);
            //   }
            // }}
          >
            <View style={[styles.headerShadowWrap, themeContainerStyle]}>
              
              <View style={[styles.header, { minWidth: widthW }]}>
                {/* Top row: title + search icon (when closed) */}
                <View style={styles.headerTopRow}>
                  <Text style={[styles.headerTitle]}>Travel & Plan</Text>
                  {!searchBar && (
                    <TouchableOpacity
                      onPress={openSearch}
                      style={styles.searchIconButton}
                    >
                      <Ionicons name="search" size={21} color="#ffffffff" />
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

                {/* Sub Tabs */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                    styles.quickStatsRow,
                    (compactStats || searchBar) &&
                      styles.quickStatsRowCollapsed,
                  ]}>
                    {TABS.map((tab) => {
                    const active = tab.key === activeTab;
                    return (
                      <TouchableOpacity
                        key={tab.key}
                        style={[styles.tabChip, active && styles.tabChipActive]}
                        onPress={() => handleTabPress(tab.key)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={tab.icon}
                          size={18}
                          color={active ? "#0f172a" : "#ffffffff"}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                          {tab.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View> 
            {/* Main content */}

            

          <Animated.View
            style={{
            flex: 1,
            // opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
            paddingHorizontal: 15,
            
          }}
        >
          {renderContent}
        </Animated.View>

            
          </ScrollView>
        </View>

        {/* Modules popping above FAB */}
        

        {/* FAB */}
        {/* <TouchableOpacity
          style={[styles.fab, { bottom: bottomOffset + 100, zIndex: 1003 }]}
          activeOpacity={0.1}
          onPress={handleFabPress}
        >
        
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <Ionicons name="add" size={28} color="#fff" />
            </Animated.View>
        </TouchableOpacity> */}

      </View>
    </>
  );
};

// ---------- Leaves View ----------

interface LeavesViewProps {
  leaves: TravelLeaveEntry[];
  onSave: () => void;
  theme: {
    container: any;
    text: any;
    card: any;
  };
}
const LeavesView: React.FC<LeavesViewProps> = ({ leaves, onSave, theme }) => {
  const [open, setOpen] = useState(false);
  return (
    <View 
    style={[styles.cardWrapper]}
    >
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle,theme.text]}>Leave Plan · 2025</Text>

        <TouchableOpacity
          style={styles.sectionAction}
          // onPress={onSave}
          onPress={() => setOpen(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="cloud-upload-outline" size={18} color="#0f172a" />
          <Text style={styles.sectionActionText}>Add Leave</Text>
        </TouchableOpacity>
      </View>

        {/* <View style={[styles.monthRow]}>
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
            (m) => (
              <View key={m} style={[styles.monthPill,theme.card]}>
                <Text style={styles.monthPillText}>{m}</Text>
              </View>
            )
          )}
        </View> */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthRow}
        >
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(
            (m) => (
              <View key={m} style={[styles.monthPill, theme.card]}>
                <Text style={styles.monthPillText}>{m}</Text>
              </View>
            )
          )}
        </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >

        {leaves.map((leave) => (
          <AnimatedLeaveCard key={leave.leaveDate} leave={leave} theme={{
            container: theme.container,
            text: theme.text,
            card: theme.card,
          }} />
        ))}
        

        {/* <TouchableOpacity style={styles.addMoreRow} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={20} color="#38bdf8" />
          <Text style={styles.addMoreText}>Add new leave / WFH</Text>
        </TouchableOpacity> */}
      </ScrollView>
      <AddLeaveBottomSheet
              visible={open}
              onClose={() => setOpen(false)}
              onSave={(data) => console.log("Leave saved", data)}
            />
    </View>
  );
};

const AnimatedLeaveCard: React.FC<{ leave: TravelLeaveEntry ,theme:any }> = ({ leave,theme }) => {
  
  const scale = useRef(new Animated.Value(1)).current;

    // const [showRemindModal, setShowRemindModal] = useState(false);
    const [daysBefore, setDaysBefore] = useState("");
    const [remindDate, setRemindDate] = useState<Date | null>(null);
    const [message, setMessage] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  // const statusColor =
  //   leave.approvalStatus === "approved"
  //     ? "#18ad4fff"
  //     : leave.approvalStatus === "rejected"
  //     ? "#ef4444"
  //     : "#c79707ff";
      

  return (
    <>
    <Animated.View
      style={[
        styles.leaveCard,
        {
          transform: [{ scale }],
        },
        theme.card,
       { borderWidth: 1
        , borderColor: "#575757ff"
      }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={[styles.leaveRowTop]}>
          <View>
            {leave.reason ? (<Text style={[styles.leaveDateText,theme.text]}>{leave.reason}</Text>) : null}
              <Text style={styles.leaveReasonText} numberOfLines={1}>
                {leave.leaveDate}
              </Text>
            
          </View>
          <View style={{ alignItems: "flex-start" ,flexDirection:"row",gap:8 }}>
            <View style={[styles.leaveTypePill1,{flexDirection:"row",alignItems:"center"}]}>
              <Text style={styles.leaveTypePillText}>{leave.leaveType}</Text>
            </View>
           {/* {leave.partOfDay!="full"&&<View style={[styles.leaveTypePill2,{flexDirection:"row",alignItems:"center" }]}>
              <Text style={[styles.leavePartOfDayText]}>{leave.partOfDay}</Text>
            </View>} */}
          </View>
        </View>
        <View style={styles.leaveRowBottom}>
          <View style={styles.statusDotWrapper}>
            {/* <View
              style={[
                styles.statusDot,
              ]}
            /> */}
            <Text style={styles.statusText}>{leave.remainder_msg
              }</Text>
          </View>
          {/* {leave.remindAt && (leave.approvalStatus === "pending" || leave.approvalStatus === "rejected") && ( */}
            <TouchableOpacity style={[styles.remindChip,{ backgroundColor: leave.notify ? "#ba3d3dff" : "white" }]} onPress={() => {}}>
              <Ionicons
                name="notifications-off-outline"
                size={18}
                color="#222d46ff"
                // style={{ fontWeight: "heavy"}}
              />
              {/* <Text style={styles.remindChipText}>mute</Text> */}
            </TouchableOpacity>
          {/* )} */}
        </View>
      </TouchableOpacity>
    </Animated.View>
    </>
    
  );
};



// ---------- Trips View ----------

interface TripsViewProps {
  trip: TravelTrip;
  theme: {
    container: any;
    text: any;
    card: any;
  };
}

const TripsView: React.FC<TripsViewProps> = ({ trip }) => {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Upcoming Trip</Text>
        <View style={styles.badgeSoft}>
          <Ionicons name="airplane" size={14} color="#0284c7" />
          <Text style={styles.badgeSoftText}>{trip.destination}</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tripHeroCard}>
          <Text style={styles.tripTitleText}>{trip.destination}</Text>
          <Text style={styles.tripDateRangeText}>
            {trip.fromDate} → {trip.toDate}
          </Text>

          <View style={styles.tripRow}>
            <Ionicons name="people" size={16} color="#e0f2fe" />
            <Text style={styles.tripRowText}>{trip.travelers.join(", ")}</Text>
          </View>

          {typeof trip.budget === "number" && (
            <View style={styles.tripRow}>
              <Ionicons name="wallet" size={16} color="#e0f2fe" />
              <Text style={styles.tripRowText}>Budget: ₹{trip.budget}</Text>
            </View>
          )}

          <View style={styles.tripProgressRow}>
            <TripStatusPill
              label="Tickets"
              done={trip.transport.some((t) => t.status === "booked")}
            />
            <TripStatusPill
              label="Stay"
              done={trip.stay.some((s) => s.status === "booked")}
            />
            <TripStatusPill
              label="Packing"
              done={trip.checklist.every((c) => c.done)}
            />
          </View>
        </View>

        {/* Transport */}
        <Text style={styles.subSectionTitle}>Transport</Text>
        {trip.transport.map((t) => (
          <View key={t.pnrOrBookingId || t.departureAt} style={styles.transportCard}>
            <View style={styles.transportRow}>
              <View style={styles.transportIconCircle}>
                <Ionicons
                  name={
                    t.mode === "flight"
                      ? "airplane"
                      : t.mode === "train"
                      ? "train"
                      : t.mode === "bus"
                      ? "bus"
                      : "car"
                  }
                  size={18}
                  color="#0f172a"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.transportRouteText}>
                  {t.from} → {t.to}
                </Text>
                <Text style={styles.transportMetaText}>{t.departureAt}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{t.status}</Text>
              </View>
            </View>
            {t.pnrOrBookingId && (
              <Text style={styles.transportExtraText}>PNR: {t.pnrOrBookingId}</Text>
            )}
          </View>
        ))}

        {/* Checklist */}
        <Text style={styles.subSectionTitle}>Checklist</Text>
        {trip.checklist.map((item) => (
          <View key={item.item} style={styles.checklistRow}>
            <Ionicons
              name={item.done ? "checkbox" : "square-outline"}
              size={18}
              color={item.done ? "#22c55e" : "#64748b"}
            />
            <Text
              style={[
                styles.checklistText,
                item.done && { textDecorationLine: "line-through", color: "#64748b" },
              ]}
            >
              {item.item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const TripStatusPill: React.FC<{ label: string; done: boolean }> = ({
  label,
  done,
}) => {
  return (
    <View
      style={[
        styles.tripStatusPill,
        done && { backgroundColor: "rgba(34,197,94,0.16)" },
      ]}
    >
      <Ionicons
        name={done ? "checkmark-circle" : "ellipse-outline"}
        size={14}
        color={done ? "#22c55e" : "#e5e7eb"}
        style={{ marginRight: 4 }}
      />
      <Text
        style={[
          styles.tripStatusText,
          done && { color: "#bbf7d0", fontWeight: "600" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

// ---------- Tickets View ----------

interface TicketsViewProps {
  tickets: TravelTicketToBook[];
  theme: {
    container: any;
    text: any;
    card: any;
  };
}

const TicketsView: React.FC<TicketsViewProps> = ({ tickets }) => {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Tickets to Book</Text>
        <Text style={styles.sectionHint}>Set reminders before quota fills.</Text>
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.ticketId}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => <TicketCard ticket={item} />}
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const TicketCard: React.FC<{ ticket: TravelTicketToBook }> = ({ ticket }) => {
  const modeIcon =
    ticket.mode === "train"
      ? "train"
      : ticket.mode === "bus"
      ? "bus"
      : "airplane";

  return (
    <View style={styles.ticketCard}>
      <View style={styles.ticketTopRow}>
        <View style={styles.ticketIconCircle}>
          <Ionicons name={modeIcon} size={18} color="#0f172a" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.ticketRouteText}>
            {ticket.from} → {ticket.to}
          </Text>
          <Text style={styles.ticketMetaText}>
            {ticket.travelDate} · {ticket.preferredTimeRange}
          </Text>
        </View>
        <View style={styles.ticketPlatformPill}>
          <Text style={styles.ticketPlatformText}>{ticket.platform}</Text>
        </View>
      </View>

      <View style={styles.ticketBottomRow}>
        {ticket.priceLimit && (
          <Text style={styles.ticketPriceText}>Max: ₹{ticket.priceLimit}</Text>
        )}
        <View style={styles.remindCountChip}>
          <Ionicons
            name="notifications-outline"
            size={14}
            color="#0f172a"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.remindCountText}>
            {ticket.remindAt.length} reminders
          </Text>
        </View>
      </View>
    </View>
  );
};

// ---------- Holidays View ----------

interface HolidaysViewProps {
  holidays: TravelHoliday[];
  theme: {
    container: any;
    text: any;
    card: any;
  };
}

const HolidaysView: React.FC<HolidaysViewProps> = ({ holidays }) => {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Future Holidays</Text>
        <Text style={styles.sectionHint}>Plan long weekends ahead.</Text>
      </View>

      {holidays.map((h) => (
        <View key={h.id} style={styles.holidayCard}>
          <View style={styles.holidayLeft}>
            <Text style={styles.holidayTitle}>{h.title}</Text>
            <Text style={styles.holidayDate}>{h.date}</Text>
            {h.notes ? (
              <Text style={styles.holidayNotes} numberOfLines={2}>
                {h.notes}
              </Text>
            ) : null}
          </View>
          <View style={styles.holidayRight}>
            <View style={styles.holidayChip}>
              <Ionicons name="sparkles" size={14} color="#0f172a" />
              <Text style={styles.holidayChipText}>Plan trip</Text>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addMoreRow} activeOpacity={0.8}>
        <Ionicons name="add-circle-outline" size={20} color="#38bdf8" />
        <Text style={styles.addMoreText}>Add custom holiday / off</Text>
      </TouchableOpacity>
    </View>
  );
};

// ---------- Styles ----------

const styles = StyleSheet.create({
  safe: {
      paddingHorizontal: 14,
    flex: 1,
},
container: {
    flex: 1,
    backgroundColor: "rgba(223, 213, 19, 1)",
    // paddingTop: 12,
    // alignItems: "center",
    // justifyContent: "space-around",
    // gap: 10,
},
headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "50%",
    marginBottom: 16,
},
title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e5e7eb",
},
subtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
},
headerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 1)",
},
tabRow: {
    flexDirection: "row",
    marginBottom: 8,
},
tabChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1f2937",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: "#4f10e0d0",
  },
tabChipActive: {
    backgroundColor: "#ffffffff",
    // borderColor: "#000000ff",
},
tabLabel: {
      // backgroundColor: "#18d03aff",
    fontSize: 13,
    color: "#ffffffff",
  },
  tabLabelActive: {
    color: "#0f172a",
    fontWeight: "600",
  },
  cardWrapper: {
    flex: 1,
    // borderRadius: 18,
    // borderWidth: 1,
    // borderColor: "#ffffffff",
    paddingHorizontal: 5,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#e0f2fe",
  },
  sectionActionText: {
    fontSize: 10,
    marginLeft: 5,
    color: "#0f172a",
    fontWeight: "500",
  },
  sectionHint: {
    fontSize: 11,
    color: "#6b7280",
  },
  monthRow: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    marginBottom: 10,
  },
  monthPill: {
    borderRadius: 999,
    // borderWidth: 1,
    borderColor: "#1f2937",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  monthPillText: {
    fontSize: 9,
    color: "#9ca3af",
  },
  leaveCard: {
    borderRadius: 14,
    borderWidth: 10,
    borderColor: "#1f2937",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#020617",
  },
  leaveRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  leaveDateText: {
    fontSize: 14,
    fontWeight: "600",
    // color: "#e5e7eb",
  },
  leaveReasonText: {
    fontSize: 12,
    color: "#7e8590ff",
    marginTop: 2,
    maxWidth: 200,
  },
  leaveTypePill1: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 3,
    backgroundColor: "rgba(56,189,248,0.1)",
    gap: 10,
  },
  leaveTypePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#38bdf8",
  },
  leaveTypePill2: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 3,
    backgroundColor: "rgba(240, 239, 239, 1)",
    gap: 10,
  },
  leavePartOfDayText: {
    fontWeight: "600",
    fontSize: 11,
    color: "#2c2c2cff",
    // marginTop: 4,
  },
  leaveRowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusDotWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    color: "#9ca3af",
  },
  remindChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#e0f2fe",
    fontWeight: "bold",
    color: "#ffffffff",
  },
  remindChipText: {
    fontSize: 11,
    fontWeight: "500",
  },
  addMoreRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  addMoreText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#38bdf8",
  },
  tripHeroCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "#5b6a96ff",
    marginBottom: 12,
  },
  tripTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#bfdbfe",
  },
  tripDateRangeText: {
    fontSize: 13,
    color: "#93c5fd",
    marginTop: 4,
  },
  tripRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  tripRowText: {
    fontSize: 13,
    color: "#e0f2fe",
    marginLeft: 6,
  },
  tripProgressRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  tripStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    backgroundColor: "rgba(15,23,42,0.7)",
  },
  tripStatusText: {
    fontSize: 11,
    color: "#e5e7eb",
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e7eb",
    marginTop: 4,
    marginBottom: 6,
  },
  transportCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
    padding: 10,
    marginBottom: 8,
  },
  transportRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  transportIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  transportRouteText: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  transportMetaText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  transportExtraText: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 6,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(34,197,94,0.15)",
  },
  statusPillText: {
    fontSize: 11,
    color: "#22c55e",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checklistText: {
    fontSize: 13,
    color: "#e5e7eb",
    marginLeft: 6,
  },
  badgeSoft: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(8,47,73,0.8)",
  },
  badgeSoftText: {
    fontSize: 12,
    color: "#bae6fd",
    marginLeft: 4,
  },
  // fab: {
  //   position: "absolute",
  //   bottom: 16,
  //   right: 16,
  //   width: 52,
  //   height: 52,
  //   borderRadius: 999,
  //   backgroundColor: "#38bdf8",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   elevation: 6,
  //   shadowColor: "#000",
  //   shadowOpacity: 0.5,
  //   shadowRadius: 8,
  //   shadowOffset: { width: 0, height: 4 },
  // },
  ticketCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#020617",
  },
  ticketTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ticketIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  ticketRouteText: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  ticketMetaText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  ticketPlatformPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "rgba(56,189,248,0.15)",
  },
  ticketPlatformText: {
    fontSize: 11,
    color: "#38bdf8",
    fontWeight: "600",
  },
  ticketBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    alignItems: "center",
  },
  ticketPriceText: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  remindCountChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#e0f2fe",
  },
  remindCountText: {
    fontSize: 11,
    color: "#0f172a",
    fontWeight: "500",
  },
  holidayCard: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#020617",
  },
  holidayLeft: {
    flex: 1,
  },
  holidayRight: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  holidayTitle: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  holidayDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  holidayNotes: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },
  holidayChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#e0f2fe",
  },
  holidayChipText: {
    fontSize: 11,
    color: "#0f172a",
    marginLeft: 4,
    fontWeight: "500",
  },
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
  scrollContent: {
    // backgroundColor: "green",
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
    // backgroundColor: "rgba(131, 23, 232, 0.85)",
    // gap: 8,
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
    // gap: 10,
    paddingHorizontal: 14,
    // paddingTop: 12,
    // backgroundColor: "rgba(237, 23, 23, 1)",
    // color: "#fff",
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
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.53)",
  justifyContent: "flex-end",
},
modalCard: {
  backgroundColor: "#fff",
  padding: 16,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},
modalTitle: {
  fontSize: 18,
  fontWeight: "600",
  marginBottom: 12,
},
label: {
  fontSize: 13,
  color: "#475569",
  marginTop: 10,
},
input: {
  borderWidth: 1,
  borderColor: "#e2e8f0",
  borderRadius: 8,
  padding: 10,
  marginTop: 6,
},
dateBtn: {
  flexDirection: "row",
  alignItems: "center",
  padding: 12,
  borderWidth: 1,
  borderColor: "#e2e8f0",
  borderRadius: 8,
  marginTop: 6,
},
actionsRow: {
  flexDirection: "row",
  justifyContent: "flex-end",
  marginTop: 16,
},
cancel: {
  color: "#64748b",
  marginRight: 16,
  paddingHorizontal: 16,
  paddingVertical: 8,
},
saveBtn: {
  backgroundColor: "#471d63ff",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
},
saveText: {
  color: "#fff",
  fontWeight: "500",
},





});

export default TravelPlanningScreen;



