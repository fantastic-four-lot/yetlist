import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

export type CardProps = ViewProps & {
  children: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ style, children, ...rest }) => {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    // backgroundColor: "rgba(15,23,42,0.9)",
    padding: 16,
    borderWidth: 1,
    // borderColor: "rgba(55,65,81,0.7)",
   
    
  },
});

export default Card;
