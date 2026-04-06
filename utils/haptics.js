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

export async function impactHaptic(style = "medium") {
  try {
    const impactStyle =
      style === "light"
        ? Haptics.ImpactFeedbackStyle.Light
        : style === "heavy"
        ? Haptics.ImpactFeedbackStyle.Heavy
        : Haptics.ImpactFeedbackStyle.Medium;
    await Haptics.impactAsync(impactStyle);
  } catch {
    // Gracefully skip haptics on unsupported platforms.
  }
}
