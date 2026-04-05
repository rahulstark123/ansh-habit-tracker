import { createContext, useContext, useMemo, useState } from "react";

const HabitContext = createContext(null);

const initialHabits = [
  {
    id: "1",
    name: "Drink Water",
    frequency: "Daily",
    completedToday: false,
    streak: 7,
    completedCount: 18,
    totalCount: 22
  },
  {
    id: "2",
    name: "Read 20 Minutes",
    frequency: "Daily",
    completedToday: true,
    streak: 12,
    completedCount: 26,
    totalCount: 30
  },
  {
    id: "3",
    name: "Workout",
    frequency: "Weekly",
    completedToday: false,
    streak: 4,
    completedCount: 9,
    totalCount: 12
  }
];

function updateStats(habit, nextCompleted) {
  if (nextCompleted) {
    return {
      ...habit,
      completedToday: true,
      streak: habit.streak + 1,
      completedCount: habit.completedCount + 1,
      totalCount: habit.totalCount + 1
    };
  }

  return {
    ...habit,
    completedToday: false,
    streak: Math.max(0, habit.streak - 1),
    completedCount: Math.max(0, habit.completedCount - 1),
    totalCount: Math.max(1, habit.totalCount)
  };
}

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState(initialHabits);

  const value = useMemo(
    () => ({
      habits,
      toggleHabit: (habitId) => {
        setHabits((current) =>
          current.map((habit) => {
            if (habit.id !== habitId) {
              return habit;
            }
            return updateStats(habit, !habit.completedToday);
          })
        );
      },
      addHabit: ({ name, frequency }) => {
        setHabits((current) => [
          {
            id: String(Date.now()),
            name: name.trim(),
            frequency,
            completedToday: false,
            streak: 0,
            completedCount: 0,
            totalCount: 1
          },
          ...current
        ]);
      },
      getHabitById: (habitId) => habits.find((habit) => habit.id === habitId)
    }),
    [habits]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within HabitProvider");
  }
  return context;
}
