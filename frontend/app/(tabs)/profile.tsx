
// app/(tabs)/profile.tsx
import React, { useState } from "react";
import { ScrollView, View, Text, Image, StyleSheet, Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<"about" | "activity" | "saved">("about");

  return (
    <ScrollView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]} contentInsetAdjustmentBehavior="automatic">
      {/* Header */}
      <View style={styles.headerRow} accessible accessibilityLabel="Profile header">
        <Image
          source={{ uri: "https://i.pravatar.cc/200?img=12" }}
          style={styles.avatar}
          accessibilityLabel="Profile picture"
        />
        <View style={styles.headerText}>
          <Text style={[styles.name, isDark ? styles.textDark : styles.textLight]}>Naveen K</Text>
          <Text style={[styles.handle, isDark ? styles.mutedDark : styles.mutedLight]}>@naveenk</Text>
          <Text style={[styles.bio, isDark ? styles.mutedDark : styles.mutedLight]} numberOfLines={2}>
            Product-minded dev. Coffee ☕ + Morning routines 🌅 + Reminders 📌
          </Text>
        </View>
        <Pressable
          style={styles.settingsBtn}
          onPress={() => router.push("/settings")}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Ionicons name="settings-outline" size={22} color={isDark ? "#fff" : "#111"} />
        </Pressable>
      </View>

      {/* Stats */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]} accessibilityLabel="Profile statistics">
        <Stat label="Routines" value="12" isDark={isDark} />
        <Stat label="Reminders" value="38" isDark={isDark} />
        <Stat label="Streak" value="7d" isDark={isDark} />
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.primaryBtn, isDark ? styles.primaryBtnDark : styles.primaryBtnLight]}
          onPress={() => router.push("/profile/edit")}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Edit Profile</Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryBtn, isDark ? styles.secondaryBtnDark : styles.secondaryBtnLight]}
          onPress={() => setFollowing((f) => !f)}
          accessibilityRole="button"
          accessibilityLabel={following ? "Unfollow" : "Follow"}
        >
          <Ionicons name={following ? "checkmark-circle-outline" : "person-add-outline"} size={18} color={isDark ? "#fff" : "#111"} />
          <Text style={[styles.secondaryBtnText, isDark ? styles.textDark : styles.textLight]}>
            {following ? "Following" : "Follow"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryBtn, isDark ? styles.secondaryBtnDark : styles.secondaryBtnLight]}
          onPress={() => router.push("/messages/new?n=@naveenk")}
          accessibilityRole="button"
          accessibilityLabel="Message"
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={isDark ? "#fff" : "#111"} />
          <Text style={[styles.secondaryBtnText, isDark ? styles.textDark : styles.textLight]}>Message</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow} accessibilityRole="tablist">
        {(["about", "activity", "saved"] as const).map((t) => {
          const active = tab === t;
          return (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabBtn, active && (isDark ? styles.tabActiveDark : styles.tabActiveLight)]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Open ${t} tab`}
            >
              <Text style={[styles.tabText, active ? styles.tabTextActive : (isDark ? styles.mutedDark : styles.mutedLight)]}>
                {t[0].toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Tab Content */}
      {tab === "about" && (
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <InfoRow icon="mail-outline" label="Email" value="naveen@example.com" isDark={isDark} />
          <InfoRow icon="call-outline" label="Phone" value="+91 98765 43210" isDark={isDark} />
          <InfoRow icon="location-outline" label="Location" value="Guindy, Chennai" isDark={isDark} />
          <InfoRow icon="globe-outline" label="Website" value="naveenk.dev" isDark={isDark} />
          <InfoRow icon="calendar-outline" label="Joined" value="Dec 2023" isDark={isDark} last />
        </View>
      )}

      {tab === "activity" && (
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <ActivityItem title="Completed Morning Boost" time="Today, 6:45 AM" isDark={isDark} />
          <ActivityItem title="Set new reminder: Hydrate" time="Yesterday, 9:00 PM" isDark={isDark} />
          <ActivityItem title="Edited Profile bio" time="Jan 3, 2026" isDark={isDark} last />
        </View>
      )}

      {tab === "saved" && (
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <SavedCard title="Morning Boost" subtitle="Routine • 5 steps" isDark={isDark} />
          <SavedCard title="Hydration Reminder" subtitle="Reminder • daily" isDark={isDark} />
          <SavedCard title="Focus Sprint" subtitle="Routine • 25m" isDark={isDark} last />
        </View>
      )}

      {/* Spacer */}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function Stat({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>{value}</Text>
      <Text style={[styles.statLabel, isDark ? styles.mutedDark : styles.mutedLight]}>{label}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  isDark,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isDark: boolean;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && styles.infoDivider]}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={18} color={isDark ? "#aeb0b3" : "#666"} />
        <Text style={[styles.infoLabel, isDark ? styles.mutedDark : styles.mutedLight]}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, isDark ? styles.textDark : styles.textLight]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ActivityItem({ title, time, isDark, last }: { title: string; time: string; isDark: boolean; last?: boolean }) {
  return (
    <View style={[styles.activityItem, !last && styles.infoDivider]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="flash-outline" size={18} color={isDark ? "#aeb0b3" : "#666"} style={{ marginRight: 8 }} />
        <Text style={[styles.activityTitle, isDark ? styles.textDark : styles.textLight]}>{title}</Text>
      </View>
      <Text style={[styles.activityTime, isDark ? styles.mutedDark : styles.mutedLight]}>{time}</Text>
    </View>
  );
}

function SavedCard({ title, subtitle, isDark, last }: { title: string; subtitle: string; isDark: boolean; last?: boolean }) {
  return (
    <View style={[styles.savedCard, !last && styles.infoDivider]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.savedTitle, isDark ? styles.textDark : styles.textLight]}>{title}</Text>
        <Text style={[styles.savedSubtitle, isDark ? styles.mutedDark : styles.mutedLight]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={18} color={isDark ? "#aeb0b3" : "#666"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightBg: { backgroundColor: "#f8f9fb" },
  darkBg: { backgroundColor: "#0f1115" },

  headerRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#ddd" },
  headerText: { flex: 1, marginLeft: 12 },
  name: { fontSize: 20, fontWeight: "700" },
  handle: { fontSize: 14, marginTop: 2 },
  bio: { fontSize: 13, marginTop: 6 },
  settingsBtn: { padding: 6, marginLeft: 8 },

  card: { borderRadius: 12, marginHorizontal: 16, marginTop: 8, padding: 12 },
  cardLight: { backgroundColor: "#fff", borderWidth: StyleSheet.hairlineWidth, borderColor: "#e6e8eb" },
  cardDark: { backgroundColor: "#151821", borderWidth: StyleSheet.hairlineWidth, borderColor: "#202433" },

  stat: { flex: 1, alignItems: "center", paddingVertical: 6 },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 12, marginTop: 2 },
  actionsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 10 },
  primaryBtn: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, paddingVertical: 10, borderRadius: 10 },
  primaryBtnLight: { backgroundColor: "#3b82f6" },
  primaryBtnDark: { backgroundColor: "#2563eb" },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  secondaryBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth },
  secondaryBtnLight: { backgroundColor: "#fff", borderColor: "#e6e8eb" },
  secondaryBtnDark: { backgroundColor: "#151821", borderColor: "#202433" },
  secondaryBtnText: { fontWeight: "600" },

  tabsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginTop: 14 },
  tabBtn: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth },
  tabActiveLight: { backgroundColor: "#fff", borderColor: "#3b82f6" },
  tabActiveDark: { backgroundColor: "#151821", borderColor: "#2563eb" },
  tabText: { fontSize: 13, fontWeight: "700" },
  tabTextActive: { color: "#3b82f6" },

  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  infoDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#232733" },
  infoLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 13, fontWeight: "600", maxWidth: "60%" },

  activityItem: { paddingVertical: 10 },
  activityTitle: { fontSize: 13, fontWeight: "600" },
  activityTime: { fontSize: 12, marginTop: 2 },

  savedCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  savedTitle: { fontSize: 13, fontWeight: "600" },
  savedSubtitle: { fontSize: 12, marginTop: 2 },

  textLight: { color: "#0f1115" },
  textDark: { color: "#fff" },
  mutedLight: { color: "#666" },
  mutedDark: { color: "#aeb0b3" },
});
``
