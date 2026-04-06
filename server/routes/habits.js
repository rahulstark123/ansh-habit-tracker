const express = require("express");
const prisma = require("../prisma/client");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

// GET /api/habits - Get all habits for logged-in user
router.get("/", async (req, res) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
      include: { logs: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/habits - Create a new habit
router.post("/", async (req, res) => {
  const { title, description, icon, color, frequency, targetValue, targetUnit, reminderTime, timeOfDay } = req.body;
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
  const { title, description, icon, color, frequency, targetValue, targetUnit, reminderTime, timeOfDay } = req.body;
  try {
    const habit = await prisma.habit.update({
      where: { id: req.params.id },
      data: { title, description, icon, color, frequency, targetValue, targetUnit, reminderTime, timeOfDay },
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
    const log = await prisma.habitLog.create({
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
