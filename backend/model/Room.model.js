const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["classroom", "lab"],
      default: "classroom",
    },
    // Useful for finding specific labs (e.g., Computer Lab vs Chemistry Lab)
    specialEquipment: [{
      type: String,
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);
