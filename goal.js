const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const User = require("./user");

const Goal = sequelize.define(
  "goal",
  {
    goal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goal_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    added_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Goal.belongsTo(User, { foreignKey: "user_id" });

module.exports = Goal;
