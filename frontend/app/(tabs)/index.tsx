// import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { Image } from 'expo-image';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';
// import { Link } from 'expo-router';
// import React from 'react';

// export default function HomeScreen() {
//   const colorScheme = useColorScheme();
//   const tintColor = Colors[colorScheme ?? 'light'].tint;

//   // Sample data (you can replace with data from storage or API)
//   const upcomingPlans = [
//     { id: 1, title: 'Trip to Ooty', date: '2025-10-15', reminder: '2 days before' },
//     { id: 2, title: 'Vacation in Goa', date: '2025-11-02', reminder: '1 week before' },
//   ];

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <ThemedView style={styles.header}>
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.logo}
//         />
//         <ThemedText type="title">Journey Reminder</ThemedText>
//         <ThemedText type="default">Plan early. Never miss your ticket!</ThemedText>
//       </ThemedView>

//       {/* Upcoming Plans Section */}
//       <ThemedView style={styles.section}>
//         <ThemedText type="subtitle">Upcoming Plans</ThemedText>

//         {upcomingPlans.length > 0 ? (
//           upcomingPlans.map((plan) => (
//             <ThemedView key={plan.id} style={styles.planCard}>
//               <ThemedText type="defaultSemiBold">{plan.title}</ThemedText>
//               <ThemedText>Date: {plan.date}</ThemedText>
//               <ThemedText>Reminder: {plan.reminder}</ThemedText>
//             </ThemedView>
//           ))
//         ) : (
//           <ThemedText>No upcoming plans. Add one below!</ThemedText>
//         )}
//       </ThemedView>

//       {/* Add New Plan Button */}
//       <Link href="/Routine" asChild>
//         <TouchableOpacity style={[styles.addButton, { backgroundColor: tintColor }]}>
//           <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
//             + Add New Plan
//           </ThemedText>
//         </TouchableOpacity>
//       </Link>

//       {/* Tips / Footer */}
//       <ThemedView style={styles.footer}>
//         <ThemedText type="default">
//           💡 Tip: Set reminders a few days before your journey to get the best ticket deals.
//         </ThemedText>
//       </ThemedView>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   logo: {
//     height: 100,
//     width: 100,
//     marginBottom: 8,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   planCard: {
//     padding: 12,
//     borderRadius: 12,
//     marginVertical: 8,
//     backgroundColor: 'rgba(0,0,0,0.05)',
//   },
//   addButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   footer: {
//     marginTop: 30,
//     alignItems: 'center',
//     paddingBottom: 50,
//   },
// });
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Card from "../../components/ui/Card";

const stats = [
  { icon: "heart", label: "Health Score", value: "92%", color: "#fb7185" },
  { icon: "trending-up", label: "Productivity", value: "85%", color: "#38bdf8" },
  { icon: "clock", label: "Time Saved", value: "3.5h", color: "#a855f7" },
  { icon: "award", label: "Achievements", value: "24", color: "#f59e0b" },
] as const;

const recentActivities = [
  { title: "Morning Workout", time: "06:00 AM", completed: true },
  { title: "Team Meeting", time: "10:00 AM", completed: true },
  { title: "Lunch Break", time: "12:30 PM", completed: false },
  { title: "Project Review", time: "03:00 PM", completed: false },
] as const;

const BG_URI =
  "https://images.unsplash.com/photo-1703357855675-ad745162c598?fm=jpg&w=1080";

const HomeTab: React.FC = () => {
  return (
    <ImageBackground source={{ uri: BG_URI }} style={styles.background}>
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>
              Here's your day at a glance
            </Text>
          </View>

          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <Card key={stat.label} style={styles.statCard}>
                <View
                  style={[
                    styles.statIconWrap,
                    { backgroundColor: stat.color },
                  ]}
                >
                  <Feather name={stat.icon as any} size={18} color="#ffffff" />
                </View>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </Card>
            ))}
          </View>

          <View>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <Card style={styles.scheduleCard}>
              {recentActivities.map((activity, index) => (
                <View
                  key={activity.title}
                  style={[
                    styles.activityRow,
                    index === recentActivities.length - 1 && styles.activityRowLast,
                  ]}
                >
                  <View style={styles.activityInfo}>
                    <View
                      style={[
                        styles.activityIndicator,
                        activity.completed && styles.activityIndicatorDone,
                      ]}
                    />
                    <View>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityTime}>{activity.time}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.activityStatus,
                      activity.completed && styles.activityStatusDone,
                    ]}
                  >
                    <Text
                      style={[
                        styles.activityStatusText,
                        activity.completed && styles.activityStatusTextDone,
                      ]}
                    >
                      {activity.completed ? "Done" : "Pending"}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.61)",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 106,
  },
  scrollContent: {
    // paddingBottom: 16,
    gap: 24,
  },
  header: {
    marginTop: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#d0d6dfff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: "47%",
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
  },
  scheduleCard: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(55,65,81,0.9)",
  },
  activityRowLast: {
    borderBottomWidth: 0,
  },
  activityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  activityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#4b5563",
  },
  activityIndicatorDone: {
    backgroundColor: "#22c55e",
  },
  activityTitle: {
    fontSize: 14,
    color: "#e5e7eb",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  activityStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(75,85,99,1)",
  },
  activityStatusDone: {
    borderColor: "#22c55e",
    backgroundColor: "rgba(22,163,74,0.15)",
  },
  activityStatusText: {
    fontSize: 11,
    color: "#9ca3af",
  },
  activityStatusTextDone: {
    color: "#4ade80",
    fontWeight: "500",
  },
});

export default HomeTab;

