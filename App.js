import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppearanceProvider } from "./context/AppearanceContext";
import { HabitProvider } from "./context/HabitContext";
import HomeScreen from "./screens/HomeScreen";
import AddHabitScreen from "./screens/AddHabitScreen";
import HabitDetailScreen from "./screens/HabitDetailScreen";
import InsightsScreen from "./screens/InsightsScreen";
import WeekScreen from "./screens/WeekScreen";
import HabitsScreen from "./screens/HabitsScreen";
import MilestonesScreen from "./screens/MilestonesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { getNavigationTheme, useAppTheme } from "./theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 62 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10)
        },
        tabBarItemStyle: {
          justifyContent: "center"
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginBottom: 2
        },
        tabBarActiveTintColor: theme.colors.textPrimary,
        tabBarInactiveTintColor: theme.colors.textMuted
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size - 1} />
          )
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarLabel: "Habits",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "list" : "list-outline"} color={color} size={size - 1} />
          )
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          tabBarLabel: "Stats",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} color={color} size={size - 1} />
          )
        }}
      />
      <Tab.Screen
        name="Week"
        component={WeekScreen}
        options={{
          tabBarLabel: "Week",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} color={color} size={size - 1} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Me",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size - 1} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const theme = useAppTheme();
  const navTheme = getNavigationTheme(theme.isDark, theme.colors);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background
          }
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="AddHabit" component={AddHabitScreen} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
        <Stack.Screen name="Milestones" component={MilestonesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <HabitProvider>
        <RootNavigator />
      </HabitProvider>
    </AppearanceProvider>
  );
}
