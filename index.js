const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("./user");
const Goal = require("./goal");

const app = express();

app.use(cors());

app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/goals", async (req, res) => {
  try {
    const goals = await Goal.findAll();

    res.status(200).json(goals);
  } catch (error) {
    console.error("Could not fetch goals:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/add-a-goal", async (req, res) => {
  const { goalName, category } = req.body;

  try {
    const newGoal = await Goal.create({
      goal_name: goalName,
      category: category,
    });

    res.status(201).json({ message: "Goal added successfully", goal: newGoal });
  } catch (error) {
    console.error("Could not add a goal:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/login", async (req, res) => {
  const { enteredEmail, enteredPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email: enteredEmail } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      enteredPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const { enteredEmail, enteredPassword } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email: enteredEmail } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(enteredPassword, 10);
    await User.create({ email: enteredEmail, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening for requests on port ${PORT}`);
});
