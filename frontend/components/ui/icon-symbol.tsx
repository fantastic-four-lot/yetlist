import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';
import React from 'react';

/**
 * An icon component that uses Material Icons directly on all platforms.
 * You can now pass any valid Material Icon name like "cake", "flight", "calendar-today", etc.
 * See all icons at: https://icons.expo.fyi
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      name={name as any}
      size={size}
      color={color}
      style={style}
    />
  );
}
