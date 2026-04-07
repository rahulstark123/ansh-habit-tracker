const express = require("express");
const prisma = require("../prisma/client");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

function getDayBounds(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function toISODateKey(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getCompletedStreak(logs) {
  const completedDateSet = new Set(
    logs
      .filter((log) => !!log.completed)
      .map((log) => toISODateKey(log.date))
  );
  if (completedDateSet.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (completedDateSet.has(toISODateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function withDerivedMetrics(habit) {
  const logs = Array.isArray(habit.logs) ? habit.logs : [];
  const { start, end } = getDayBounds();
  const todaysLog = logs.find((log) => {
    const ts = new Date(log.date).getTime();
    return ts >= start.getTime() && ts < end.getTime();
  });
  const completedCount = logs.filter((log) => !!log.completed).length;

  return {
    ...habit,
    completedToday: !!todaysLog?.completed,
    completedCount,
    totalCount: logs.length,
    streak: getCompletedStreak(logs),
  };
}

// GET /api/habits - Get all habits for logged-in user
router.get("/", async (req, res) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
      include: { logs: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(habits.map(withDerivedMetrics));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/habits - Create a new habit
router.post("/", async (req, res) => {
  const { title, description, icon, color, frequency, targetValue, targetUnit, reminderTime, reminderRepeat, timeOfDay } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const habit = await prisma.habit.create({
      data: {
        title,
        description,
        icon,
        color,
        frequency: frequency || "daily",
        targetValue: targetValue || 1,
        targetUnit: targetUnit || "times",
        reminderTime,
        reminderRepeat: reminderRepeat || "daily",
        timeOfDay: timeOfDay || "all",
        userId: req.userId,
      },
    });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/habits/:id - Update a habit
router.put("/:id", async (req, res) => {
  const { title, description, icon, color, frequency, targetValue, targetUnit, reminderTime, reminderRepeat, timeOfDay } = req.body;
  try {
    const habit = await prisma.habit.update({
      where: { id: req.params.id },
      data: { title, description, icon, color, frequency, targetValue, targetUnit, reminderTime, reminderRepeat, timeOfDay },
    });
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/habits/:id - Delete a habit
router.delete("/:id", async (req, res) => {
  try {
    await prisma.habitLog.deleteMany({ where: { habitId: req.params.id } });
    await prisma.habit.delete({ where: { id: req.params.id } });
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/habits/:id/log - Log habit completion for today
router.post("/:id/log", async (req, res) => {
  const { completed } = req.body;
  try {
    const habit = await prisma.habit.findFirst({
      where: { id: req.params.id, userId: req.userId },
      select: { id: true },
    });
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const { start, end } = getDayBounds();
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId: req.params.id,
        date: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { date: "desc" },
    });

    const log = existingLog
      ? await prisma.habitLog.update({
          where: { id: existingLog.id },
          data: { completed: completed ?? true },
        })
      : await prisma.habitLog.create({
          data: {
            habitId: req.params.id,
            completed: completed ?? true,
          },
        });

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
