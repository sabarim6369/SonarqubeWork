const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema({
  type: {
    type: String,
    enum: ["predefined", "manual"],
    required: true,
    default: "predefined",
  },
  problemName: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
  },
  link: {
    type: String,
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  description: {
    type: String,
  },
  constraints: {
    type: String,
  },
  sampleInput: {
    type: String,
  },
  sampleOutput: {
    type: String,
  },
  manualTestCases: [
    {
      input: {
        type: String,
        required: false,
      },
      output: {
        type: String,
        required: false,
      },
      isHidden: {
        type: Boolean,
        default: false,
      },
    },
  ],
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  studentsCompleted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const Coding = mongoose.model("Problem", problemSchema);
module.exports = Coding;
