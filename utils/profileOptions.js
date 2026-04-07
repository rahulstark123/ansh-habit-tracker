export const GOAL_OPTIONS = [
  { id: "build", label: "Building Habits 🔨" },
  { id: "consistent", label: "Staying Consistent ♾️" },
  { id: "productivity", label: "Improving Productivity ⚡" },
];

export const LEVEL_OPTIONS = [
  { id: "beginner", label: "Beginner 🌱" },
  { id: "intermediate", label: "Intermediate 🌿" },
  { id: "master", label: "Master 🏆" },
];

export const FOCUS_TIME_OPTIONS = [
  { id: "morning", label: "Morning 🌅" },
  { id: "afternoon", label: "Afternoon ☀️" },
  { id: "evening", label: "Evening 🌕" },
  { id: "all", label: "All Day 🕒" },
];

export function getOptionLabel(options, id, fallback = "Not set") {
  const match = options.find((item) => item.id === id);
  return match ? match.label : fallback;
}
