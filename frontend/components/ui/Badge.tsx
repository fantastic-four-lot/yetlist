import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

export type BadgeProps = {
  label: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  style?: ViewStyle;
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  backgroundColor = "rgba(31,41,55,0.9)",
  borderColor = "transparent",
  textColor = "#e5e7eb",
  style,
}) => {
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "500",
  },
});

export default Badge;
