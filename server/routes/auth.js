const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        onboardingCompleted: user.onboardingCompleted,
        goal: user.goal,
        level: user.level,
        focusTime: user.focusTime,
        remindersEnabled: user.remindersEnabled
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        onboardingCompleted: user.onboardingCompleted,
        goal: user.goal,
        level: user.level,
        focusTime: user.focusTime,
        remindersEnabled: user.remindersEnabled
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/auth/onboarding
const authMiddleware = require("../middleware/auth");
router.put("/onboarding", authMiddleware, async (req, res) => {
  const { goal, remindersEnabled, level, focusTime } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: {
        goal,
        level,
        focusTime,
        remindersEnabled: remindersEnabled || false,
        onboardingCompleted: true,
      },
    });
    res.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        onboardingCompleted: updated.onboardingCompleted,
        goal: updated.goal,
        level: updated.level,
        focusTime: updated.focusTime,
        remindersEnabled: updated.remindersEnabled
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/auth/profile
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, goal, level, focusTime } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(typeof name === "string" ? { name: name.trim() } : {}),
        ...(typeof goal === "string" ? { goal } : {}),
        ...(typeof level === "string" ? { level } : {}),
        ...(typeof focusTime === "string" ? { focusTime } : {}),
      },
    });

    res.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        onboardingCompleted: updated.onboardingCompleted,
        goal: updated.goal,
        level: updated.level,
        focusTime: updated.focusTime,
        remindersEnabled: updated.remindersEnabled,
        createdAt: updated.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/signout
router.post("/signout", authMiddleware, async (req, res) => {
  // Statelenss JWT logout just confirms session end
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
