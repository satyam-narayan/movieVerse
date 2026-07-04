import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import AppNavigator from "./stacks/app.stack";
import Colors from "@/constants/colors";

const AppContent = () => (
  <View style={styles.container}>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default AppContent