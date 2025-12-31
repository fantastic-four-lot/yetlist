import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";


type LeaveType = "CL" | "SL" | "PL" | "WFH" | "OTHER";
type PartOfDay = "full" | "1st half" | "2nd half";

export interface TravelLeaveEntry {
  leaveDate: string;
  leaveType: LeaveType;
  partOfDay: PartOfDay;
  reason?: string;
  remainder_msg: string;
  remindAt?: string[];
  notify?: boolean;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: TravelLeaveEntry) => void;
}

export const AddLeaveBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  const [leaveType, setLeaveType] = useState<LeaveType>("CL");
  const [partOfDay, setPartOfDay] = useState<PartOfDay>("full");
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 300,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleSave = () => {
    onSave({
      leaveDate: new Date().toISOString().split("T")[0],
      leaveType,
      partOfDay,
      reason,
      remainder_msg: reason || "Leave planned",
      notify,
    });
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none">
  {/* Dismiss keyboard when tapping outside */}
  <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(), onClose()}} >
    <View style={styles.backdrop} />
  </TouchableWithoutFeedback>

  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.keyboardContainer}
  >
    <Animated.View
      style={[
        styles.sheet,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Leave</Text>
        </View>

        {/* Leave Type */}
        <Text style={styles.label}>Leave Type</Text>
        <View style={styles.row}>
          {["CL", "SL", "PL", "WFH", "OTHER"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setLeaveType(type as LeaveType)}
              style={[
                styles.pill,
                leaveType === type && styles.pillActive,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  leaveType === type && styles.pillTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Part of Day */}
        <Text style={styles.label}>Part of Day</Text>
        <View style={styles.row}>
          {["full", "1st half", "2nd half"].map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPartOfDay(p as PartOfDay)}
              style={[
                styles.pill,
                partOfDay === p && styles.pillActive,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  partOfDay === p && styles.pillTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reason */}
        <Text style={styles.label}>Reason</Text>
        <TextInput
          placeholder="Optional reason"
          value={reason}
          onChangeText={setReason}
          style={styles.input}
          multiline
          returnKeyType="done"
        />

        {/* Notify */}
        <View style={styles.switchRow}>
          <Text style={styles.label}>Notify me</Text>
          <Switch value={notify} onValueChange={setNotify} />
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Leave</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  </KeyboardAvoidingView>
</Modal>

  );
};


const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(45, 45, 45, 0.4)",
  },
  keyboardContainer: {
  position: "absolute",
  bottom: 0,
  width: "100%",
  height: "94%",
},

  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "65%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  pillActive: {
    backgroundColor: "#2563eb",
  },
  pillText: {
    fontSize: 13,
    color: "#555",
  },
  pillTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    minHeight: 60,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
