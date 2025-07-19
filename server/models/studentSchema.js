const mongoose = require("mongoose");
const Counter = require("./counterSchema");

const studentSchema = new mongoose.Schema({
  student_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  program_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
  ],
  platforms: {
    type: Object,
    default: {
      leetcode: "not-assigned",
      hackerrank: "not-assigned",
      codechef: "not-assigned",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pass: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  RollNo: {
    type: String,
    default: "",
  },
  registerNo: {
    type: String,
    default: "",
  },
  userStatus: {
    type: String,
    default: "",
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  userLevel: {
    type: String,
    default: "",
  },
  skillSet: {
    type: String,
    default: "",
  },
  domain: {
    type: String,
    default: "",
  },
  certification: {
    type: String,
    default: "",
  },
  coding: {
    type: [Object],
    default: [],
  },
});

studentSchema.pre("save", async function (next) {
  if (!this.student_id) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "student_id" },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );

      this.student_id = counter.sequence_value;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
