import { StatusBar, LogBox } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from "./src/context/ThemeContext"
import { SensorProvider } from "./src/context/SensorContext"
import { ToastProvider } from "./src/context/ToastContext"
import { VideoRecordingProvider } from "./src/context/VideoRecordingContext"
import AppNavigator from "./src/navigation/AppNavigator"
import { FloatingRecordingIndicator } from "./src/components/FloatingRecordingIndicator"
import { useNavigation } from "@react-navigation/native"

// Ignore specific warnings
LogBox.ignoreLogs(["new NativeEventEmitter"])

const AppContent = () => {
  const navigation = useNavigation()

  const handleIndicatorPress = () => {
    navigation.navigate("VideoRecording" as never)
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <AppNavigator />
      <FloatingRecordingIndicator onPress={handleIndicatorPress} />
    </>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <SensorProvider>
              <VideoRecordingProvider>
                <NavigationContainer>
                  <AppContent />
                </NavigationContainer>
              </VideoRecordingProvider>
            </SensorProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
