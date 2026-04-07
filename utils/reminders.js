import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

const REMINDER_MAP_KEY = "@habit_reminder_map_v1";
const ANDROID_CHANNEL_ID = "habit-reminders";

async function getReminderMap() {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

async function setReminderMap(map) {
  try {
    await AsyncStorage.setItem(REMINDER_MAP_KEY, JSON.stringify(map));
  } catch (error) {}
}

async function ensureReminderPermissions() {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return !!requested.granted;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Habit Reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 300, 200, 300],
    lightColor: "#6366f1",
    sound: "default",
  });
}

function parseReminderTime(reminderTime) {
  if (!reminderTime || typeof reminderTime !== "string") return null;
  const [hourText, minuteText] = reminderTime.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function getHabitTitle(habit) {
  return habit?.title || habit?.name || "Your Habit";
}

function getOneTimeTrigger(hour, minute) {
  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setSeconds(0, 0);
  triggerDate.setHours(hour, minute, 0, 0);
  if (triggerDate.getTime() <= now.getTime()) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }
  return triggerDate;
}

async function scheduleReminderForHabit(habit) {
  const time = parseReminderTime(habit?.reminderTime);
  if (!time) return null;

  const hasPermission = await ensureReminderPermissions();
  if (!hasPermission) return null;

  await ensureAndroidChannel();

  const repeatMode = habit?.reminderRepeat === "once" ? "once" : "daily";

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Time for ${getHabitTitle(habit)} ⏰`,
      body: "Keep your momentum going. Complete this habit now.",
      sound: "default",
      data: { habitId: habit?.id },
    },
    trigger:
      repeatMode === "daily"
        ? {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: time.hour,
            minute: time.minute,
            channelId: Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined,
          }
        : getOneTimeTrigger(time.hour, time.minute),
  });

  return notificationId;
}

export async function upsertHabitReminder(habit) {
  if (!habit?.id) return;
  const map = await getReminderMap();
  const existingId = map[habit.id];

  if (existingId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    } catch (error) {}
  }

  const newId = await scheduleReminderForHabit(habit);
  if (newId) {
    map[habit.id] = newId;
  } else {
    delete map[habit.id];
  }
  await setReminderMap(map);
}

export async function clearHabitReminder(habitId) {
  if (!habitId) return;
  const map = await getReminderMap();
  const existingId = map[habitId];
  if (existingId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    } catch (error) {}
  }
  delete map[habitId];
  await setReminderMap(map);
}
