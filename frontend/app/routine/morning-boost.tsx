import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function MorningBoost() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Drink a glass of water", done: false },
    { id: 2, text: "10-min stretch", done: false },
    { id: 3, text: "Meditate for 5 mins", done: false },
    { id: 4, text: "Read one chapter", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <LinearGradient
      colors={["#d2b755ff", "#c78220ff", "#c0725eff"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.greeting}>Good Morning, Neufer ☀️</Text>
        <Text style={styles.subtext}>Here’s your boost for today</Text>

        {/* Quote Card */}
        <BlurView intensity={20} tint="prominent" style={styles.card}>
          <Text style={styles.quote}>
            “Discipline beats motivation every single morning.”
          </Text>
        </BlurView>

        {/* Task Section */}
        <Text style={styles.sectionTitle}>🌤️ Your Morning Routine</Text>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            onPress={() => toggleTask(task.id)}
            activeOpacity={0.8}
          >
            <BlurView
              intensity={20}
              tint="default"
              style={[
                styles.taskCard,
                task.done && { backgroundColor: "rgba(255,255,255,0.3)" },
              ]}
            >
              <Ionicons
                name={task.done ? "checkmark-circle" : "ellipse-outline"}
                size={26}
                color={task.done ? "#13722fff" : "#FFF"}
              />
              <Text
                style={[
                  styles.taskText,
                  task.done && { textDecorationLine: "line-through", color: "#CCC" },
                ]}
              >
                {task.text}
              </Text>
            </BlurView>
          </TouchableOpacity>
        ))}

        {/* Mood + Energy */}
        <Text style={styles.sectionTitle}>⚡ Quick Check-In</Text>
        <View style={styles.moodContainer}>
          {["😴", "😐", "🙂", "😎", "🔥"].map((m, idx) => (
            <TouchableOpacity key={idx} style={styles.moodItem}>
              <Text style={styles.moodText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* End of Boost */}
        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={["rgba(116, 3, 3, 0.71)", "rgba(184, 4, 4, 0.71)"]}
            style={styles.finishButton}
          >
            <Text style={styles.finishText}>I’m Ready for Today </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#795316ff",
  },
  subtext: {
    color: "#ffffffff",
    opacity: 0.8,
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    borderRadius:20,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.13)",
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#ffffffff",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
    marginBottom: 10,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
    gap: 10,
  },
  taskText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  moodItem: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 50,
    padding: 12,
  },
  moodText: {
    fontSize: 26,
  },
  finishButton: {
    marginTop: 30,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  finishText: {
    color: "#eaeaeaff",
    fontWeight: "700",
    fontSize: 18,
  },
});
