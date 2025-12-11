// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { TabBar, TabsType } from "@mindinventory/react-native-tab-bar-interaction";
// import { useNavigationState } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/Ionicons";
// import { IconSymbol } from "./ui/icon-symbol";
// import { useColorScheme, Dimensions } from "react-native";


// interface AnimatedTabBarProps {
//   navigation: any;
//   state: any;
//   descriptors: any;
// }

// export const AnimatedTabBar = ({ navigation, state }: AnimatedTabBarProps) => {
//   const tabs: TabsType[] = [
//     {
//       name: 'index',
//       activeIcon: <IconSymbol size={25} name="house" color={"white"} />,
//       inactiveIcon:<IconSymbol size={25} name="house" color={"black"} />
//     },
//     {
//       name: 'Reminder',
//       activeIcon: <IconSymbol size={25} name="alarm" color={"white"} />,
//       inactiveIcon: <IconSymbol size={25} name="alarm" color={"black"} />
//     },
//     {
//       name: 'Essentials',
//       activeIcon: <IconSymbol size={25} name="checklist" color={"white"} />,
//       inactiveIcon: <IconSymbol size={25} name="checklist" color={"black"} />
//     },
//     {
//       name: 'Routine',
//       activeIcon:  <IconSymbol size={25} name="next-week" color={"white"} />,
//       inactiveIcon: <IconSymbol size={25} name="next-week" color={"black"} />
//     },
//     {
//       name: 'Wishes',
//       activeIcon: <IconSymbol size={25} name="cake" color={"white"} />,
//       inactiveIcon: <IconSymbol size={25} name="cake" color={"black"} />
//     },
  
//   ];
//   const { width } = Dimensions.get("window");
//   const colorScheme = useColorScheme();

//   // Dynamic color based on theme
//   const dynamicCircleColor = colorScheme === "dark" ? "#4b3ba5ff" : "#4b3ba5ff";


//   return (
//     <View style={styles.tabContainer}>
//       <TabBar
//         tabs={tabs}
//         containerWidth={width}
//         onTabChange={(tab: TabsType, index: number) => {
//           navigation.navigate(tab.name);
//         }}
//         containerBottomSpace={0}
//         transitionSpeed={150}
//         containerTopRightRadius= {0}
//         containerTopLeftRadius= {0}
//         containerBottomLeftRadius= {10}
//         containerBottomRightRadius= {10}
//         circleFillColor= {dynamicCircleColor}

//         // currentTab={state.routeNames[state.index]}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   tabContainer: {
//     // position: "absolute",
//     // bottom: 15,
//     // left: 15,
//     // right: 15,
//     // borderRadius: 20,
//     // shadowColor: "#000",
//     // shadowOpacity: 0.5,
//     // shadowRadius: 4,
//     // elevation: 2,
//     // textAlign:"center"
//   },
// });





import React from "react";
import { View, StyleSheet, Dimensions, useColorScheme } from "react-native";
import { TabBar, TabsType } from "@mindinventory/react-native-tab-bar-interaction";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "./ui/icon-symbol";

interface AnimatedTabBarProps {
  navigation: any;
  state: any;
  descriptors: any;
}

export const AnimatedTabBar = ({ navigation, state }: AnimatedTabBarProps) => {
  const { bottom } = useSafeAreaInsets(); // ✅ gets bottom safe area
  const { width } = Dimensions.get("window");
  const colorScheme = useColorScheme();

  const dynamicCircleColor = colorScheme === "dark" ? "#4b3ba5ff" : "red";

  const tabs: TabsType[] = [
    {
      name: "index",
      activeIcon: <IconSymbol size={30} name="house" color={"white"} />,
      inactiveIcon: <IconSymbol size={30} name="house" color={"#221186ff"} />,
    },
    {
      name: "Reminder",
      activeIcon: <IconSymbol size={30} name="alarm" color={"white"} />,
      inactiveIcon: <IconSymbol size={30} name="alarm" color={"#221186ff"} />,
    },
    // {
    //   name: "Essentials",
    //   activeIcon: <IconSymbol size={25} name="checklist" color={"white"} />,
    //   inactiveIcon: <IconSymbol size={25} name="checklist" color={"#221186ff"} />,
    // },
    {
      name: "Routine",
      activeIcon: <IconSymbol size={30} name="next-week" color={"white"} style={{position:"absolute",top:-4,zIndex:50}} />,
      inactiveIcon: <IconSymbol size={30} name="next-week" color={"#221186ff"} />,
    },
    {
      name: "Wishes",
      activeIcon: <IconSymbol size={30} name="cake" color={"white"} />,
      inactiveIcon: <IconSymbol size={30} name="cake" color={"#221186ff"} />,
    },
  ];

  return (
    <View style={[styles.tabContainer, { paddingBottom: bottom }]}>
      <TabBar
        tabs={tabs}
        containerWidth={width}
        onTabChange={(tab: TabsType) => {
          navigation.navigate(tab.name);
        }}
        containerBottomSpace={bottom}
        transitionSpeed={150}
        containerTopRightRadius={0}
        containerTopLeftRadius={0}
        containerBottomLeftRadius={10}
        containerBottomRightRadius={10}
        circleFillColor={dynamicCircleColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
  },
});

