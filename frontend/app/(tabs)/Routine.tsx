// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions,Image, Alert } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Carousel from "react-native-reanimated-carousel"; 
// import { FloatingSearch } from "@/components/FloatingSearch";
// import { useRouter } from 'expo-router';


// type CardItem = {
//   id: string;
//   title: string;
//   subtitle?: string;
//   icon: string;
//   icon_bgcolor?:string // Ionicons name
// };
// const IMAGES = [
//   "https://img.freepik.com/free-photo/futurism-perspective-digital-nomads-lifestyle_23-2151252534.jpg?t=st=1761224552~exp=1761228152~hmac=a10a9032110a90a421f6488d80b959c8f769079d0bddc6257ba5920ca918afaf&w=1480",
//   "https://img.freepik.com/free-photo/3d-cartoon-fitness-man_23-2151691403.jpg?t=st=1761221763~exp=1761225363~hmac=bfd33b3ce4332d118cceb2eda3048ed222ee562c0babbb5cc69eb3e9df148de2&w=1480",
//   "https://img.freepik.com/free-photo/guava-fruit-still-life_23-2151551076.jpg?ga=GA1.1.1534090149.1745661096&semt=ais_hybrid&w=740&q=80",
//   "https://img.freepik.com/free-psd/fashion-shopping-background_23-2150752492.jpg?ga=GA1.1.1534090149.1745661096&semt=ais_hybrid&w=740&q=80",
//   "https://img.freepik.com/free-photo/view-3d-airplane-with-travel-destination-landscape_23-2151022220.jpg?ga=GA1.1.1534090149.1745661096&semt=ais_hybrid&w=740&q=80",
//   "https://img.freepik.com/free-photo/people-cinema-watching-movie_23-2151005467.jpg?t=st=1761222563~exp=1761226163~hmac=6feb6ae7ec5aaf0a4f928c3ff6b74b782b19c20b4b1c8665641bcd5056c548a4&w=1480"
// ];

// const DATA: CardItem[] = [
//   // { id: '1', title: 'Daily', subtitle: 'Sleep & Meals', icon: 'time' },
//   // { id: '2', title: 'Health', subtitle: 'Meds & Workout', icon: 'fitness' },
//   // { id: '3', title: 'Care', subtitle: 'Hydration & Relax', icon: 'water' },
//   // { id: '4', title: 'Shopping', subtitle: 'Shopping & Chores', icon: 'basket' },
//   // { id: '5', title: 'Travel', subtitle: 'Commute & Plans', icon: 'car' },
//   // { id: '6', title: 'Movies', subtitle: 'fun & friends', icon: 'film' },

//   { id: '1', title: 'Morning Boost', subtitle: 'Wake up & Hydrate', icon: 'sunny' ,icon_bgcolor:"#edd205ff"},
//   { id: '2', title: 'Mind & Focus', subtitle: 'Plan your Day', icon: 'bulb' ,icon_bgcolor:"#0d2fdcff"},
//   { id: '3', title: 'Work Mode', subtitle: 'Tasks & Meetings', icon: 'briefcase' ,icon_bgcolor:"#000000"},
//   { id: '4', title: 'Body Care', subtitle: 'Workout & Move', icon: 'barbell' ,icon_bgcolor:"#c70d7fff"},
//   { id: '5', title: 'Me-Time', subtitle: 'Relax & Unwind', icon: 'bed' ,icon_bgcolor:"#108f0cff"},
//   { id: '6', title: 'Prep Tomorrow', subtitle: 'Reflect & Sleep', icon: 'moon' ,icon_bgcolor:"#ab0a0aff"},
// ];

// export default function RoutineCardsComponent({ onCardPress }: { onCardPress?: (item: CardItem)=>{} }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchBar,setSearchBar]=useState(true)


//    const filteredData = DATA.filter(item =>
//     item.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const router = useRouter();

//   const handleCardPress = (item) => {
//   console.log("Card Pressed", `You tapped: ${item.title}`);
//     // or navigate to another page
//     // router.push(`/routine/${item.id}`);
//     switch (item.title) {
//       case "Morning Boost":
//         router.push("/routine/morning-boost");
//         break;

//       case "Mind & Focus":
//         router.push("/routine/mind-focus");
//         break;

//       case "Body Care":
//         router.push("/routine/body-care");
//         break;

//       case "Work Mode":
//         router.push("/routine/work-mode");
//         break;

//       case "Me-Time":
//         router.push("/routine/me-time");
//         break;

//       case "Prep Tomorrow":
//         router.push("/routine/prep-tomorrow");
//         break;

//       default:
//         Alert.alert("Unknown Module", `No module found for ${item.title}`);
//         break;
//   };
// }

//   const renderItem = ({ item }: { item: CardItem }) => (
//     <TouchableOpacity
//       style={styles.card}
//       activeOpacity={0.8}
//       onPress={() =>{handleCardPress(item)}}
//     >
//     <View style={{
//       width: 58,
//       height: 58,
//       borderRadius: 10,
//       backgroundColor: item.icon_bgcolor,
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginTop:25,
//    // marginRight: 12,
//   }}>
//         <Ionicons name={item.icon} size={37} color={"white"} />
//       </View>

//       <View style={styles.textWrap}>
//         <Text style={styles.title}>{item.title}</Text>
//         {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
//       </View>

//       {/* <View style={styles.chevWrap}>
//         <Ionicons name="chevron-forward" size={20} />
//       </View> */}
//     </TouchableOpacity>
//   );

// const { height, width } = Dimensions.get("window");
// // console.log(height+"H")
// // console.log(width+"W")

  
//   return (
//     <LinearGradient
//       colors={["#26262bff", "#230d9dff", "#b9b7c2ff"]}
//       style={styles.gradient}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//     >
      
//       <View style={styles.container}>
//         <Text style={[styles.heading,{paddingBottom:searchBar? 8:45}]}>Routine</Text>


//         <FlatList
//           data={filteredData}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           numColumns={2}
//           columnWrapperStyle={styles.row}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 90 }}
//           ListHeaderComponent={
//             <View style={styles.carouselContainer}>
//               <Carousel
//                   width={width}
//                   height={230}
//                   data={IMAGES}
//                   loop
//                   autoPlay
//                   mode="parallax"
//                   autoPlayInterval={4000} 
//                   modeConfig={{
//                     parallaxScrollingScale: 0.85,
//                     parallaxScrollingOffset: 60,
//                   }}
//                   style={{ alignSelf: "center" }}
//                   renderItem={({ item }) => (
//                     <View
//                       style={{
//                         borderRadius: 20,
//                         overflow: "hidden",
//                         shadowColor: "#000",
//                         shadowOpacity: 0.3,
//                         shadowOffset: { width: 0, height: 4 },
//                         shadowRadius: 8,
//                       }}
//                     >
//                       <Image
//                         source={{ uri: item }}
//                         style={{
//                           width: "100%",
//                           height: 230,
//                           resizeMode: "cover",
//                         }}
//                       />
//                     </View>
//                   )}
//                 />
//             </View>
//           }
//         />
//         <FloatingSearch onSearch={setSearchQuery} onView={setSearchBar} />
//       </View>
     

//     </LinearGradient>
    
    
//   );
// }

// const styles = StyleSheet.create({
//   // incontainer:{
//   //   height:()
//   // },
//   gradient: {
//     flex: 1, 
//   },
//   container: {
//     flex: 1,        
//     paddingHorizontal: 17,
//     paddingBottom: 25,
//     },
//   row: {
//     justifyContent: 'space-between',
//     marginBottom: 15,
//     gap:15
//   },
//   card: {
//     backgroundColor: '#ffffffff',
//     flex:1,
//     minWidth: 150,
//     maxWidth: '49%',
//     borderRadius: 12,
//     padding: 10,
//     flexDirection: 'column',
//     alignItems: 'center',
//     height:180,
//     shadowColor: '#000000ff',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.06,
//     shadowRadius: 22,
//     // elevation (Android)
//     elevation: 3,
//     justifyContent:'center'
//   },
//   iconWrap: {
//     width: 48,
//     height: 48,
//     borderRadius: 10,
//     backgroundColor: '#2e20ccff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop:30,
//   },
//   textWrap: {
//     flex: 1,
//     marginTop:10
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#0F172A',
//   },
//   subtitle: {
//     fontSize: 10,
//     color: '#64748B',
//     marginTop: 4,
//     textAlign:"center"
//   },
//   chevWrap: {
//     // marginLeft: 6,
//     opacity: 0.8,
//   },
//   heading:
//   {
//     fontSize: 30,
//     fontWeight: '600',
//     color: '#ffffffff',
//     marginTop:60,
//     marginLeft:12
    
//   },
//   carouselItem: {
//     backgroundColor: "#fff",
//     borderRadius: 30,
//     height: 180,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//   },
//     carouselContainer: {
//     // position: "absolute",
//     // top: 255,
//     // left: 0,
//     // right: 0,
//     height: 250,
//     // justifyContent: "center",
//     alignItems: "center",
//   },
//   carouselCard: {
//   borderRadius: 20,
//   height: 230,
//   backgroundColor: "#ffffffff",
//   justifyContent: "center",
//   alignItems: "center",
//   shadowColor: "#000",
//   shadowOpacity: 0.3,
//   shadowRadius: 5,
//   elevation: 5,
//   },
//   carouselText: {
//     fontSize: 22,
//     color: "#411398ff",
//     fontWeight: "bold",
//   },


// });

import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG_URI =
  "https://images.unsplash.com/photo-1582203775364-6ce6139cfecf?fm=jpg&w=1080";

const routines = [
  {
    icon: "coffee",
    title: "Morning Ritual",
    time: "06:00 - 07:00",
    tasks: ["Meditation", "Coffee", "Journal"],
    color: "#f59e0b",
    completed: 3,
    total: 3,
  },
  {
    icon: "activity",
    title: "Workout Session",
    time: "07:00 - 08:00",
    tasks: ["Warm-up", "Strength Training", "Cool down"],
    color: "#f97373",
    completed: 2,
    total: 3,
  },
  {
    icon: "book-open",
    title: "Learning Time",
    time: "19:00 - 20:00",
    tasks: ["Read 30 mins", "Practice coding", "Review notes"],
    color: "#3b82f6",
    completed: 0,
    total: 3,
  },
  {
    icon: "moon",
    title: "Night Routine",
    time: "22:00 - 23:00",
    tasks: ["Skincare", "Reading", "Sleep prep"],
    color: "#a855f7",
    completed: 0,
    total: 3,
  },
] as const;

const RoutineTab: React.FC = () => {

    const insets = useSafeAreaInsets();  
    const bottomOffset = Math.max(insets.bottom || 0)
    const { height: screenH } = Dimensions.get('screen');
    const { height: windowH } = Dimensions.get('window');
    let navBarHeightDp = 0;
    if (Platform.OS === 'android') {
      const diffPx = Math.max(0, screenH - windowH);
      const ratio = PixelRatio.get();
      navBarHeightDp = Math.round(diffPx / ratio);
    } 
    const contentPaddingBottom = Math.max(bottomOffset, navBarHeightDp);

    return (
    <ImageBackground source={{ uri: BG_URI }} style={styles.background}>
      <View style={styles.overlay}>
      <View style={[{height:'90%'}]}>
        <ScrollView
          contentContainerStyle={[  styles.scrollContent, { paddingBottom: contentPaddingBottom }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Daily Routine</Text>
            <Text style={styles.headerSubtitle}>
              Build better habits, one day at a time
            </Text>
          </View>

          <Card style={styles.progressCard}>
            <View style={styles.progressHeaderRow}>
              <View>
                <Text style={styles.progressLabel}>Today's Progress</Text>
                <Text style={styles.progressSummary}>
                  5 of 12 tasks completed
                </Text>
              </View>
              <Text style={styles.progressValue}>42%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: "42%" }]} />
            </View>
          </Card>

          <View style={styles.listWrapper}>
            {routines.map((routine) => {
              const progress =
                routine.total > 0
                  ? Math.round((routine.completed / routine.total) * 100)
                  : 0;

              return (
                <Card key={routine.title} style={styles.routineCard}>
                  <View style={styles.routineRow}>
                    <View
                      style={[
                        styles.routineIconWrap,
                        { backgroundColor: `${routine.color}33` },
                      ]}
                    >
                      <Feather
                        name={routine.icon as any}
                        size={22}
                        color="#ffffff"
                      />
                    </View>
                    <View style={styles.routineContent}>
                      <View style={styles.routineHeaderRow}>
                        <View>
                          <Text style={styles.routineTitle}>
                            {routine.title}
                          </Text>
                          <Text style={styles.routineTime}>
                            {routine.time}
                          </Text>
                        </View>
                        <Badge
                          label={`${routine.completed}/${routine.total}`}
                          backgroundColor="rgba(31,41,55,0.9)"
                          borderColor="transparent"
                          textColor="#e5e7eb"
                        />
                      </View>

                      <View style={styles.tasksWrapper}>
                        {routine.tasks.map((task, index) => {
                          const done = index < routine.completed;
                          return (
                            <View key={task} style={styles.taskRow}>
                              <View
                                style={[
                                  styles.taskDot,
                                  done && styles.taskDotDone,
                                ]}
                              />
                              <Text
                                style={[
                                  styles.taskLabel,
                                  done && styles.taskLabelDone,
                                ]}
                              >
                                {task}
                              </Text>
                            </View>
                          );
                        })}
                      </View>

                      {progress > 0 && (
                        <View style={styles.taskProgressTrack}>
                          <View
                            style={[
                              styles.taskProgressFill,
                              { width: `${progress}%` },
                            ]}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        </ScrollView>
      </View>
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
    backgroundColor: "rgba(15, 23, 42, 0.83)",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  scrollContent: {
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
    color: "#d1d5db",
  },
  progressCard: {
    padding: 16,
    backgroundColor: "rgba(88,28,135,0.22)",
    borderColor: "rgba(168,85,247,0.6)",
  },
  progressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 13,
    color: "#d1d5db",
    marginBottom: 4,
  },
  progressSummary: {
    fontSize: 14,
    color: "#f9fafb",
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  progressBarTrack: {
    marginTop: 12,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(31,41,55,0.9)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#a855f7",
  },
  listWrapper: {
    gap: 12,
  },
  routineCard: {
    padding: 16,
  },
  routineRow: {
    flexDirection: "row",
    gap: 12,
  },
  routineIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)",
  },
  routineContent: {
    flex: 1,
  },
  routineHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  routineTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 2,
  },
  routineTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  tasksWrapper: {
    marginTop: 6,
    gap: 6,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#4b5563",
  },
  taskDotDone: {
    backgroundColor: "#22c55e",
  },
  taskLabel: {
    fontSize: 13,
    color: "#e5e7eb",
  },
  taskLabelDone: {
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
  taskProgressTrack: {
    marginTop: 10,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(31,41,55,0.9)",
    overflow: "hidden",
  },
  taskProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#a855f7",
  },
});

export default RoutineTab;


