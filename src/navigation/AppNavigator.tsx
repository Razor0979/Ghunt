"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { BarChart3, FileText, Home, Users } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"

// Screens
import HomeScreen from "../screens/HomeScreen"
import SensorsScreen from "../screens/SensorsScreen"
import RecordScreen from "../screens/RecordScreen"
import TeamScreen from "../screens/TeamScreen"
import SettingsScreen from "../screens/SettingsScreen"
import EMFScannerScreen from "../screens/sensors/EMFScannerScreen"
import RadioFrequencyScreen from "../screens/sensors/RadioFrequencyScreen"
import BaselineScreen from "../screens/BaselineScreen"
import EVPSessionScreen from "../screens/record/EVPSessionScreen"
import VideoRecordingScreen from "../screens/record/VideoRecordingScreen"
import ReportScreen from "../screens/ReportScreen"
import AddTeamMemberScreen from "../screens/team/AddTeamMemberScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function MainTabs() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Sensors"
        component={SensorsScreen}
        options={{
          tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{
          tabBarIcon: ({ color }) => <FileText size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Team"
        component={TeamScreen}
        options={{
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EMFScanner" component={EMFScannerScreen} />
      <Stack.Screen name="RadioFrequency" component={RadioFrequencyScreen} />
      <Stack.Screen name="Baseline" component={BaselineScreen} />
      <Stack.Screen name="EVPSession" component={EVPSessionScreen} />
      <Stack.Screen name="VideoRecording" component={VideoRecordingScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="AddTeamMember" component={AddTeamMemberScreen} />
    </Stack.Navigator>
  )
}
