const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  programId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  batch: {
    type: Number,
    required: true,
    trim: true,
  },
  college: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "College",
  },
  code: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  trainerAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },
  programStatus: {
    type: String,
    enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  dailyTasks: {
    type: [
      {
        date: {
          type: Date,
          required: true,
        },
        taskName: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    default: null,
  },
  studentTasks: {
    type: [
      {
        date: {
          type: Date,
        },
        taskName: {
          type: String,
        },
        description: {
          type: String,
        },
        platform: {
          type: String,
        },
        link: {
          type: String,
        },
        studentsCompleted: {
          type: [
            {
              type: mongoose.Schema.ObjectId,
              ref: "Student",
            },
          ],
          default: [],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  studentsManualTasks: {
    type: [
      {
        qNo: {
          type: Number,
        },
        qName: {
          type: String,
          required: true,
        },
        qdescription: {
          type: String,
        },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "Easy",
        },
        Duedate: {
          type: Date,
          required: true,
          default: Date.now(),
        },
        manualTestCases: {
          type: [
            {
              input: {
                type: String,
                required: true,
              },
              date: {
                type: Date,
              },
              taskName: {
                type: String,
              },
              description: {
                type: String,
              },
              platform: {
                type: String,
              },
              link: {
                type: String,
              },
              studentsCompleted: {
                type: [
                  {
                    type: mongoose.Schema.ObjectId,
                    ref: "Student",
                  },
                ],
                default: [],
              },
              createdAt: {
                type: Date,
                default: Date.now,
              },
            },
          ],
          default: [],
        },
        studentsManualTasks: {
          type: [
            {
              qNo: {
                type: Number,
              },
              qName: {
                type: String,
                required: true,
              },
              qdescription: {
                type: String,
              },
              difficulty: {
                type: String,
                enum: ["easy", "medium", "hard"],
                default: "Easy",
              },
              Duedate: {
                type: Date,
                required: true,
                default: Date.now(),
              },
              manualTestCases: {
                type: [
                  {
                    input: {
                      type: String,
                      required: true,
                    },
                    output: {
                      type: String,
                      required: true,
                    },
                    isHidden: {
                      type: Boolean,
                      default: false,
                    },
                  },
                ],
                required: true,
              },
              createdAt: {
                type: Date,
                default: Date.now,
              },
            },
          ],
          default: [],
        },

        students: {
          type: [
            {
              type: mongoose.Schema.ObjectId,
              ref: "Student",
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },

  students: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Student",
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

programSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Program = mongoose.model("Program", programSchema);

module.exports = Program;
