const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  title: String,
  duration: Number,
  host: String,
  date: String,
  status: String,
  participants: [
    {
      login: String,
    },
  ],
}, {timestamps: true});


module.exports = mongoose.model("Training", trainingSchema)
