const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: String,
  password: String,
  role: String,
  contact: {
    firstName: String,
    lastName: String,
    phone: Number,
    email: String,
  },
  trainings: [
    {
      date: Date,
      price: Number,
      status: String,
      notificationSent: Boolean,
    },
  ],
  isActive: Boolean,
});


module.exports = mongoose.model("User", userSchema)
