const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },


  password: {
    type: String,
    select: false,
    required: function () {
      return this.provider === "local";
    },
  },
  role: {
    type: String,
    enum: ["admin", "hod", "teacher", "student"],
    default: "student",
  },
  avatar: {
    type: String
  },

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  mustChangePassword: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// ✅ Explicit index on email (used on every login)
registerSchema.index({ email: 1 });
// Index for role-based counts used by dashboard
registerSchema.index({ role: 1 });

const RegisterModel = mongoose.model("RegisterModel", registerSchema);

module.exports = RegisterModel;
