import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform,Image, Button } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth/AuthContext';
// import { StatusBar } from 'expo-status-bar';

// import { ThemedView } from '@/components/themed-view';


// const TAB_CONTAINER_MARGIN_HORIZONTAL = 15;
// const TAB_CONTAINER_BASE_BOTTOM = 16; // base spacing above safe area

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
const insets = useSafeAreaInsets();
const bottomOffset = (insets.bottom || 0)
  return (
    <>
    <View style={[  styles.tabContainer, { bottom: bottomOffset}]}>
      <BlurView intensity={60} tint="dark" style={styles.blurBackground}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const iconColor = isFocused ? 'rgba(171, 98, 231, 0.86)' : '#ffffffff';
          const scaleValue = new Animated.Value(isFocused ? 1.5 : 1);

          Animated.spring(scaleValue, {
            toValue: isFocused ? 1.2 : 1,
            useNativeDriver: true,
            friction: 5,
          }).start();

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              activeOpacity={0.9}
              style={styles.tabItem}
            >
              <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleValue }] }]}>
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    color: iconColor,
                    size: 26,
                  })}
              </Animated.View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? '#fff' : '#ffffffff', fontWeight: isFocused ? '800' : '400'},
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
    </>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
   const { logout } = useAuth();

  return (

    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        animation: 'shift',
         headerRight: () => <Button title="Logout" onPress={logout}  />
      }}

     
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Reminder"
        options={{
          title: 'Reminder',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="alarm" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Routine"
        options={{
          title: 'Routine',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="next-week" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Wishes"
        options={{
          title: 'Wishes',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="cake" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    left: 15,
    right: 15,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(50, 4, 93, 1)',
    shadowColor: '#4b1177ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(183, 13, 235, 0.78)',
  },
  blurBackground: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: 2,
    marginTop: 4,
  },
  tabLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
