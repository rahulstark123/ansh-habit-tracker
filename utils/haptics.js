import * as Haptics from "expo-haptics";

export async function selectionHaptic() {
  try {
    await Haptics.selectionAsync();
  } catch {
    // Gracefully skip haptics on unsupported platforms.
  }
}

export async function successHaptic() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Gracefully skip haptics on unsupported platforms.
  }
}
