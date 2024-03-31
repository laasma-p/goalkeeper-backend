const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./user");

const app = express();

app.use(cors());

app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  try {
    const goals = await db("goals").select("*");

    return res.status(200).json(goals);
  } catch (error) {
    console.error("Could not fetch goals:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/add-a-goal", async (req, res) => {
  try {
    const { goalName, category } = req.body;

    const result = await db("goals").insert({
      goal_name: goalName,
      category: category,
    });

    return res.status(201).json({
      message: "Goal added successfully.",
    });
  } catch (error) {
    console.error("Could not add a goal:", error);
    return res.status(500).json({ message: "Internal server error." });
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
