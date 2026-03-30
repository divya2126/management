const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema({
  
  name: { 
    type: String, 
    required: true },

  email: { 
    type: String, 
    required: true,
     unique: true },


  password: {
    type: String,
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
  
   provider: { type: String,
     enum: ["local", "google"],
      default: "local" },
});
const RegisterModel = mongoose.model("RegisterModel", registerSchema);

module.exports = RegisterModel;
