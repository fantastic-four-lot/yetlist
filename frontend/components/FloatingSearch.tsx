// // import React, { useState, useRef } from "react";
// // import {
// //   View,
// //   TextInput,
// //   Animated,
// //   TouchableOpacity,
// //   StyleSheet,
// //   KeyboardAvoidingView,
// //   Platform,
// //   Dimensions
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // export const FloatingSearch = ({ onSearch,onView }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [query, setQuery] = useState("");
// //   const widthAnim = useRef(new Animated.Value(45)).current; // Start small
// //   const widthtop = useRef(new Animated.Value(68)).current; // Start small

// //   const { height, width } = Dimensions.get("window");


// //   const toggleSearch = () => {

// //     onView(isOpen)
// //     handleSearch("");
// //     setIsOpen(!isOpen);
// //    if (!isOpen) {
// //       // Opening: width first, then move up
// //       Animated.sequence([
// //         Animated.timing(widthAnim, {
// //           toValue: width - 50,
// //           duration: 200,
// //           useNativeDriver: false,
// //         }),
// //         Animated.timing(widthtop, {
// //           toValue: 110,
// //           duration: 300,
// //           useNativeDriver: false,
// //         }),
// //       ]).start();
// //     } else {
// //       // Closing: move down first, then shrink
// //       Animated.sequence([
// //         Animated.timing(widthtop, {
// //           toValue: 110,
// //           duration: 300,
// //           useNativeDriver: false,
// //         }),
// //         Animated.timing(widthAnim, {
// //           toValue: 45,
// //           duration: 200,
// //           useNativeDriver: false,
// //         }),
// //       ]).start();
// //     }
// //   };

// //   const handleSearch = (text) => {
// //     setQuery(text);
// //     onSearch?.(text);
// //   };

  

// //   return (
// //     <KeyboardAvoidingView
// //       behavior={Platform.OS === "ios" ? "padding" : "height"}
// //       style={[styles.container,{top: widthtop}]}
// //     >
// //       <Animated.View style={[styles.searchContainer, { width: widthAnim }]}>
// //         {isOpen ? (
// //           <>
// //             <Ionicons name="search" size={21} color="#fff" style={{ marginLeft: 10 }} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Search"
// //               placeholderTextColor="#eee3faff"
// //               value={query}
// //               onChangeText={handleSearch}
// //               autoFocus
// //             />
// //             <TouchableOpacity onPress={toggleSearch}>
// //               <Ionicons name="close" size={22} color="#fff" style={{ marginRight: 10 }} />
// //             </TouchableOpacity>
// //           </>
// //         ) : (
// //           <TouchableOpacity onPress={toggleSearch}>
// //             <Ionicons name="search" size={21} color="#fff" />
// //           </TouchableOpacity>
// //         )}
// //       </Animated.View>
// //     </KeyboardAvoidingView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     position: "absolute", 
// //     right: 23,
// //     zIndex: 100,
// //   },
// //   searchContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#4b3ba5ff",
// //     borderRadius: 30,
// //     height: 45,
// //     shadowColor: "#000000ff",
// //     shadowOpacity: 0.2,
// //     shadowRadius: 4,
// //     elevation: 5,
// //     justifyContent:"center"
// //   },
// //   input: {
// //     flex: 1,
// //     color: "#fff",
// //     fontSize: 16,
// //     marginLeft:8,
// //     height:250
// //   },
// // });
import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AnimatedKAV = Animated.createAnimatedComponent(KeyboardAvoidingView);

export const FloatingSearch = ({ onSearch, onView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const widthAnim = useRef(new Animated.Value(40)).current;  // width of the pill
  const topAnim = useRef(new Animated.Value(15)).current;   // y-position (top)

  const { width } = Dimensions.get("window");

  const handleSearch = (text) => {
    setQuery(text);
    onSearch?.(text);
  };

  const toggleSearch = () => {
       const opening = !isOpen;
    if (opening) {
      //Open
      onView?.(isOpen);
          setTimeout(()=>{
          handleSearch("");
          setIsOpen(opening);
        },300)      
      Animated.sequence([
        Animated.timing(topAnim, {
          toValue:90,
          duration: 200,
          useNativeDriver: false, 
        }),
        Animated.timing(widthAnim, {
          toValue: width-30,
          duration: 200,
          useNativeDriver: false, 
        }),
        
      ]).start();
      
      
    } else {
      // Close
      Animated.sequence([
        Animated.timing(widthAnim, {
          toValue: 40,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(topAnim, {
          toValue: 15,
          duration: 400,
          useNativeDriver: false,
        }),
        
      ]).start();
      handleSearch("");
      setIsOpen(opening);
      setTimeout(()=>{
        onView?.(isOpen);
      },400)
    }
    
  };

  return (
    <AnimatedKAV
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { top: topAnim }]} 
    >
      <Animated.View style={[styles.searchContainer, { width: widthAnim }]}>
        {isOpen ? (
          <>
            <Ionicons name="search" size={21} color="#fff" style={{ marginLeft: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Search"
              placeholderTextColor="#eee3fa"
              value={query}
              onChangeText={handleSearch}
              autoFocus
            />
            <TouchableOpacity onPress={toggleSearch}>
              <Ionicons name="close" size={22} color="#fff" style={{ marginRight: 10 }} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={toggleSearch}>
            <Ionicons name="search" size={21} color="#fff" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </AnimatedKAV>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    zIndex: 100,
  },
  searchContainer: {
    borderColor: "rgba(0, 0, 0, 0.25)",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#786e86eb",
    borderRadius: 30,
    height: 40,
    shadowColor: "#000000ff",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginLeft: 8,
    
    // no forced height — let the container control it
  },
});
