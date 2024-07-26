import {
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import type { PropsWithChildren } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  } as ViewStyle & TextStyle,
});

function SafeScreen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {children}
    </SafeAreaView>
  );
}

export default SafeScreen;
