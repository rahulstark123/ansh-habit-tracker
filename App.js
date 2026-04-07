import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import * as Notifications from "expo-notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppearanceProvider } from "./context/AppearanceContext";
import { HabitProvider } from "./context/HabitContext";
import HomeScreen from "./screens/HomeScreen";
import AddHabitScreen from "./screens/AddHabitScreen";
import HabitDetailScreen from "./screens/HabitDetailScreen";
import EditHabitScreen from "./screens/EditHabitScreen";
import InsightsScreen from "./screens/InsightsScreen";
import WeekScreen from "./screens/WeekScreen";
import HabitsScreen from "./screens/HabitsScreen";
import MilestonesScreen from "./screens/MilestonesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import PersonalDetailsScreen from "./screens/PersonalDetailsScreen";
import SecurityScreen from "./screens/SecurityScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { getNavigationTheme, useAppTheme } from "./theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function MainTabs() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        sceneStyle: {
          backgroundColor: theme.colors.background
        },
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
  const { isAuthenticated, isLoading, user } = useAuth();
  const theme = useAppTheme();
  const navTheme = getNavigationTheme(theme.isDark, theme.colors);

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NavigationContainer theme={navTheme}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: {
              backgroundColor: theme.colors.background
            }
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          ) : user?.onboardingCompleted ? (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="AddHabit" component={AddHabitScreen} />
              <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
              <Stack.Screen name="EditHabit" component={EditHabitScreen} />
              <Stack.Screen name="Milestones" component={MilestonesScreen} />
              <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
              <Stack.Screen name="Feedback" component={FeedbackScreen} />
              <Stack.Screen name="Security" component={SecurityScreen} />
            </>
          ) : (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <HabitProvider>
          <RootNavigator />
        </HabitProvider>
      </AuthProvider>
    </AppearanceProvider>
  );
}
