const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
dotenv.config();

app.use(cors());

app.use(bodyParser.json());

const PORT = process.env.PORT;

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
