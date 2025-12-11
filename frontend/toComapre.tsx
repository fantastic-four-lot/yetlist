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

export const FloatingSearch = ({ onSearch, onView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const widthAnim = useRef(new Animated.Value(45)).current; // pill width
  const { width } = Dimensions.get("window");

  const handleSearch = (text: string) => {
    setQuery(text);
    onSearch?.(text);
  };

  const toggleSearch = () => {
    const opening = !isOpen;

    if (opening) {
      // open
      onView?.(false); // same semantics as your old version
      handleSearch("");
      setIsOpen(true);

      Animated.timing(widthAnim, {
        toValue: width - 30,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      // close
      Animated.timing(widthAnim, {
        toValue: 45,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        onView?.(true);
      });

      handleSearch("");
      setIsOpen(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.kav}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.searchContainer, { width: widthAnim }]}>
          {isOpen ? (
            <>
              <Ionicons
                name="search"
                size={21}
                color="#fff"
                style={{ marginLeft: 10 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Search"
                placeholderTextColor="#eee3fa"
                value={query}
                onChangeText={handleSearch}
                autoFocus
              />
              <TouchableOpacity onPress={toggleSearch}>
                <Ionicons
                  name="close"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={toggleSearch}>
              <Ionicons name="search" size={21} color="#fff" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  kav: {
    width: "100%",
  },
  container: {
    width: "100%",
    alignItems: "flex-end",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3f29bdad",
    borderRadius: 30,
    height: 45,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
});


