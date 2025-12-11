// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

// export default function history() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <Link href="/modal">
//           <Link.Trigger>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//           </Link.Trigger>
//           <Link.Preview />
//           <Link.Menu>
//             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
//             <Link.MenuAction
//               title="Share"
//               icon="square.and.arrow.up"
//               onPress={() => alert('Share pressed')}
//             />
//             <Link.Menu title="More" icon="ellipsis">
//               <Link.MenuAction
//                 title="Delete"
//                 icon="trash"          
//                 destructive
//                 onPress={() => alert('Delete pressed')}
//               />
//             </Link.Menu>
//           </Link.Menu>
//         </Link>

//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BG_URI =
  "https://images.unsplash.com/photo-1673124247113-a44d3c6ccbc5?fm=jpg&w=1080";

const wishes = [
  {
    icon: "send",
    title: "Travel to Japan",
    description: "Experience cherry blossoms in Kyoto",
    progress: 65,
    color: "#f97373",
    category: "Travel",
  },
  {
    icon: "music",
    title: "Learn Piano",
    description: "Master my favorite songs",
    progress: 40,
    color: "#a855f7",
    category: "Learning",
  },
  {
    icon: "home",
    title: "Buy Dream Home",
    description: "A cozy place with a garden",
    progress: 25,
    color: "#3b82f6",
    category: "Life Goal",
  },
  {
    icon: "heart",
    title: "Run a Marathon",
    description: "Complete my first 42km run",
    progress: 55,
    color: "#fb923c",
    category: "Health",
  },
  {
    icon: "briefcase",
    title: "Start a Business",
    description: "Launch my own tech startup",
    progress: 30,
    color: "#f59e0b",
    category: "Career",
  },
] as const;

const WishesTab: React.FC = () => {
    const insets = useSafeAreaInsets();
  
  
        // Compute bottom offset: prioritize safe area inset, then add base margin.
    const bottomOffset = (insets.bottom || 0)
  return (
    <ImageBackground source={{ uri: BG_URI }} style={styles.background}>
       <View style={[styles.overlay, { paddingBottom: bottomOffset  }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Feather name="star" size={22} color="#facc15" />
              <Text style={styles.headerTitle}>My Wishes</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Dreams in progress, one step at a time
            </Text>
          </View>

          <Card style={styles.motivationCard}>
            <View style={styles.motivationRow}>
              <View>
                <Text style={styles.motivationTitle}>Keep Going! ✨</Text>
                <Text style={styles.motivationSubtitle}>
                  You're 43% closer to your dreams
                </Text>
              </View>
              <Text style={styles.motivationCount}>5</Text>
            </View>
          </Card>

          <View style={styles.listWrapper}>
            {wishes.map((wish) => (
              <Card key={wish.title} style={styles.wishCard}>
                <View style={styles.wishRow}>
                  <View
                    style={[
                      styles.wishIconWrap,
                      { backgroundColor: `${wish.color}33` },
                    ]}
                  >
                    <Feather
                      name={wish.icon as any}
                      size={24}
                      color="#ffffff"
                    />
                  </View>
                  <View style={styles.wishContent}>
                    <View style={styles.wishHeaderRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.wishTitle}>{wish.title}</Text>
                        <Text style={styles.wishDescription}>
                          {wish.description}
                        </Text>
                      </View>
                      <Badge
                        label={wish.category}
                        backgroundColor="rgba(31,41,55,0.9)"
                        borderColor="transparent"
                        textColor="#e5e7eb"
                      />
                    </View>
                    <View style={styles.progressWrapper}>
                      <View style={styles.progressLabelRow}>
                        <Text style={styles.progressLabel}>Progress</Text>
                        <Text style={styles.progressPercent}>
                          {wish.progress}%
                        </Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${wish.progress}%` },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>

          <TouchableOpacity style={styles.addButton} activeOpacity={0.9}>
            <Feather name="star" size={18} color="#e5e7eb" />
            <Text style={styles.addButtonLabel}>Add New Wish</Text>
          </TouchableOpacity>
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
    backgroundColor: "rgba(15, 23, 42, 0.64)",
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#d1d5db",
  },
  motivationCard: {
    backgroundColor: "rgba(89, 5, 167, 0.43)",
    borderColor: "rgba(169, 85, 247, 1)",
    padding: 16,
  },
  motivationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  motivationTitle: {
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 4,
  },
  motivationSubtitle: {
    fontSize: 13,
    color: "#e5e7eb",
  },
  motivationCount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
  },
  listWrapper: {
    gap: 12,
  },
  wishCard: {
    padding: 16,
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  wishRow: {
    flexDirection: "row",
    gap: 12,
  },
  wishIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)",
  },
  wishContent: {
    flex: 1,
  },
  wishHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  wishTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 2,
  },
  wishDescription: {
    fontSize: 13,
    color: "#9ca3af",
  },
  progressWrapper: {
    marginTop: 10,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },
  progressPercent: {
    fontSize: 13,
    color: "#c4b5fd",
    fontWeight: "500",
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(31,41,55,0.9)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#a855f7",
  },
  addButton: {
    marginTop: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(168,85,247,0.6)",
    backgroundColor: "rgba(168,85,247,0.18)",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  addButtonLabel: {
    fontSize: 14,
    color: "#f9fafb",
    fontWeight: "500",
  },
});

export default WishesTab;

