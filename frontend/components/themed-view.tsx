import { Text, StyleSheet, View,  useColorScheme  } from 'react-native';



export default function ThemeColors() {
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeCardStyle =colorScheme === 'light' ? styles.lightThemeCard : styles.darkThemeCard;
  const themeBorderStyle =colorScheme === 'light' ? styles.lightThemeBorder : styles.darkThemeBorder;

  return (
    {themeContainerStyle,themeTextStyle,themeCardStyle,themeBorderStyle}
  );
}

const styles = StyleSheet.create({
                  // Container styles
  lightContainer: {
    backgroundColor: 'white',
  },
  darkContainer: {
    backgroundColor: '#000000ff',
  },

                  // Text styles
  lightThemeText: {
    color: '#000000ff',
  },
  darkThemeText: {
    color: 'white',
  },

                    // Border styles
  lightThemeBorder: {
    color: '#000000ff',
  },
  darkThemeBorder: {
    color: 'white',
  },

                    // Card styles
  lightThemeCard: {
    backgroundColor: 'white',
    
  },
  darkThemeCard: {
    backgroundColor: '#2f2f2fff',
  },
});
