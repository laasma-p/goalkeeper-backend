const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
require("dotenv").config();

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
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening for requests on port ${PORT}`);
});
