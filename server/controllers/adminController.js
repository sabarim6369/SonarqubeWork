const Trainer = require("../models/trainerSchema");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminSchema");
const Counter = require("../models/counterSchema");
const { createToken } = require("../utils/jwt");
const { Op } = require("sequelize");
const Program = require("../models/programSchema");
const cron = require("node-cron");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const dotenv = require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const Students = require("../models/studentSchema");
const College = require("../models/collegeSchema");
const Category = require("../models/categorySchema");
const Problem = require("../models/problemSchema");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getAdmin = async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const adminIdNumber = Number(adminId);
    if (isNaN(adminIdNumber)) {
      return res.status(400).json({ message: "Invalid Admin ID" });
    }

    const admin = await Admin.findOne({ adminId: adminIdNumber }).select(
      "-password"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ admin });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    return res.status(200).json({
      success: true,
      message: admins.length
        ? "Admins retrieved successfully"
        : "No admins found",
      admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
      deletedAdmin,
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const adminSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const counter = await Counter.findOneAndUpdate(
      { _id: "adminId" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const adminId = counter.sequence_value;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      adminId,
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    console.log(admin);
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken({ adminId: admin.adminId, email: admin.email });

    res.status(200).json({
      message: "Admin signed in successfully!",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const addTrainer = async (req, res) => {
  try {
    const { name, email, phone, age, gender, specialization, skills, address } =
      req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !age ||
      !gender ||
      !specialization ||
      !address ||
      !skills
    ) {
      console.log("Validation failed: Missing required fields.");
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      console.log("Validation failed: Invalid phone number.");
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits.",
      });
    }

    const existingTrainer = await Trainer.findOne({ phone });
    if (existingTrainer) {
      console.log("Trainer already exists with the provided phone number.");
      return res.status(400).json({
        success: false,
        message: "A trainer with the provided phone number already exists.",
      });
    }

    const counter = await Counter.findByIdAndUpdate(
      { _id: "trainerId" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    const trainerId = counter.sequence_value;

    const hashedPassword = await bcrypt.hash(phone, 10);

    const trainer = await Trainer.create({
      trainerId,
      name,
      email,
      phone,
      age,
      gender,
      specialization,
      skills,
      address,
      password: hashedPassword,
    });

    console.log("Trainer added successfully.");

    return res.status(201).json({
      success: true,
      message: "Trainer added successfully.",
      trainer: {
        trainerId: trainer.trainerId,
        name: trainer.name,
        phone: trainer.phone,
        age: trainer.age,
        gender: trainer.gender,
        specialization: trainer.specialization,
        skills: trainer.skills,
        address: trainer.address,
        email: trainer.email,
      },
    });
  } catch (error) {
    console.error("Error adding trainer:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the trainer. Please try again.",
    });
  }
};

const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().populate("programsAssigned");

    res.status(200).json({
      success: true,
      message: "Trainers retrieved successfully.",
      trainers,
    });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching trainers.",
    });
  }
};

const getTrainerById = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const trainer = await Trainer.findOne({ trainerId });
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Trainer retrieved successfully.",
      trainer,
    });
  } catch (error) {
    console.error("Error fetching trainer:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the trainer.",
    });
  }
};

const updateTrainer = async (req, res) => {
  try {
    const { trainerId, formData } = req.body;

    formData.updatedAt = Date.now();

    const trainer = await Trainer.findOneAndUpdate({ trainerId }, formData, {
      new: true,
      runValidators: true,
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer updated successfully.",
      trainer,
    });
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the trainer.",
    });
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const { trainerId } = req.query;

    const trainer = await Trainer.findOneAndDelete({ trainerId });
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the trainer.",
    });
  }
};

const generateUniqueCode = async () => {
  let attempts = 0;
  const maxAttempts = 10;

  console.log("Starting unique code generation...");

  while (attempts < maxAttempts) {
    const code = uuidv4().split("-")[0].toUpperCase();

    console.log(`Attempt ${attempts + 1}: Generated Code - ${code}`);

    const existingProgram = await Program.findOne({ code });

    if (!existingProgram) {
      console.log(`Unique code found: ${code}`);
      return code;
    }

    console.log(`Code ${code} already exists. Retrying...`);
    attempts++;
  }

  throw new Error("Failed to generate a unique code after multiple attempts.");
};

const addProgram = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const {
      name,
      description,
      startDate,
      endDate,
      batch,
      college,
      location,
      trainerAssigned,
      programStatus,
      dailyTasks,
    } = req.body.formData;

    console.log("Received dailyTasks:", dailyTasks);

    const trainer = await Trainer.findOne({ trainerId: trainerAssigned });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found.",
      });
    }

    const counter = await Counter.findByIdAndUpdate(
      { _id: "programId" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const programId = counter.sequence_value;

    const uniqueCode = await generateUniqueCode();
    console.log("Generated unique code:", uniqueCode);

    const program = new Program({
      programId,
      name,
      description,
      startDate,
      endDate,
      college,
      batch,
      location,
      code: uniqueCode,
      trainerAssigned: trainer._id,
      programStatus,
      dailyTasks: dailyTasks,
    });

    await program.save();

    trainer.availability = "Assigned";
    trainer.programsAssigned = trainer.programsAssigned || [];
    trainer.programsAssigned.push(program._id);

    await trainer.save();

    res.status(201).json({
      success: true,
      message: "Program added successfully",
      program,
    });
  } catch (error) {
    console.error("Error adding program:", error);
    res.status(500).json({
      success: false,
      message: "Error adding program",
      error: error.message,
    });
  }
};

const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find()
      .populate("trainerAssigned students college")
      .lean()
      .exec();
    const clonedPrograms = JSON.parse(JSON.stringify(programs));

    res.status(200).json({
      success: true,
      message: "Programs fetched successfully",
      programs: clonedPrograms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching programs",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  const { programId, taskId } = req.query;

  const program = await Program.findById(programId);

  if (!program) {
    return res.status(404).json({
      success: false,
      message: "Program not found",
    });
  }

  if (Array.isArray(taskId)) {
    taskId.forEach((id) => {
      const taskIndex = program.dailyTasks.findIndex(
        (task) => task._id.toString() === id
      );

      if (taskIndex !== -1) {
        program.dailyTasks.splice(taskIndex, 1);
      }
    });
  } else {
    const taskIndex = program.dailyTasks.findIndex(
      (task) => task._id.toString() === taskId
    );

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    program.dailyTasks.splice(taskIndex, 1);
  }

  await program.save();

  return res.json({
    success: true,
    message: "Task(s) deleted successfully",
  });
};

const addTask = async (req, res) => {
  const { programId, newTaskList } = req.body;

  if (!programId || !newTaskList) {
    return res.status(400).json({
      success: false,
      message: "Program ID and task data are required",
    });
  }

  const program = await Program.findById(programId);

  if (!program) {
    return res.status(404).json({
      success: false,
      message: "Program not found",
    });
  }

  const tasksWithRequiredFields = newTaskList.map((task) => ({
    date: task.date,
    taskName: task.taskName,
    description: task.taskDescription,
    completed: task.completed || false,
  }));

  program.dailyTasks.push(...tasksWithRequiredFields);

  await program.save();

  return res.json({
    success: true,
    message: "Task added successfully",
  });
};

const editProgram = async (req, res) => {
  try {
    const { programId, changes } = req.body;

    if (!programId || !changes) {
      return res.status(400).json({
        success: false,
        message: "Program ID and updated data are required",
      });
    }

    const program = await Program.findById(programId);

    if (!program) {
      return res
        .status(404)
        .json({ success: false, message: "Program not found" });
    }

    if (
      changes.trainerAssigned &&
      changes.trainerAssigned !== program.trainerAssigned.toString()
    ) {
      const oldTrainerId = program.trainerAssigned;
      if (oldTrainerId) {
        const oldTrainer = await Trainer.findById(oldTrainerId);

        if (oldTrainer) {
          if (
            oldTrainer.programsAssigned &&
            oldTrainer.programsAssigned.length > 0
          ) {
            await Trainer.updateOne(
              { _id: oldTrainerId },
              { $pull: { programsAssigned: programId } }
            );
            console.log("Old Trainer Details Updated Successfully");
          } else {
            console.log(
              "Old Trainer's Assigned Programs is empty; no removal necessary"
            );
          }
        } else {
          console.log("Old Trainer not found; skipping removal");
        }
      }

      const newTrainerId = changes.trainerAssigned;
      const newTrainer = await Trainer.findById(newTrainerId);
      if (!newTrainer) {
        return res
          .status(404)
          .json({ success: false, message: "New trainer not found" });
      }

      await Trainer.updateOne(
        { _id: newTrainerId },
        { $push: { programsAssigned: programId } }
      );
      console.log("New Trainer Updated Successfully");
      program.trainerAssigned = newTrainerId;
    } else {
      console.log("No changes in trainer assignment detected");
    }

    const updateData = { ...changes };
    delete updateData.trainerAssigned;

    if (Object.keys(updateData).length > 0) {
      await program.updateOne({ $set: updateData });
      console.log("Program Updated Successfully:", programId);
    } else {
      console.log("No additional fields to update");
    }

    await program.save();
    res.status(200).json({
      success: true,
      message: "Program updated successfully",
      program,
    });
  } catch (err) {
    console.error("Error updating program:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const { programId } = req.body;

    console.log(req.body);

    if (!programId) {
      return res
        .status(400)
        .json({ success: false, message: "Program ID is required" });
    }

    const program = await Program.findByIdAndDelete(programId).lean();

    if (!program) {
      return res
        .status(404)
        .json({ success: false, message: "Program not found" });
    }

    const trainer = await Trainer.findOne({
      ean: program.trainerAssigned,
    }).lean();

    if (trainer) {
      trainer.programsAssigned = trainer.programsAssigned.filter(
        (assignedProgram) => assignedProgram.toString() !== programId
      );

      await Trainer.findOneAndUpdate(
        { ean: program.trainerAssigned },
        { programsAssigned: trainer.programsAssigned }
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Program deleted successfully" });
  } catch (err) {
    console.error("Error deleting program:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

console.log("Cron job started. Updating program statuses every second.");

cron.schedule("* * * * * *", async () => {
  const today = moment().startOf("day");

  try {
    const programs = await Program.find({
      programStatus: { $ne: "Cancelled" },
    });

    programs.forEach(async (program) => {
      const startDate = moment(program.startDate);
      const endDate = moment(program.endDate);

      if (
        startDate.isSame(today, "day") &&
        program.programStatus !== "Ongoing"
      ) {
        program.programStatus = "Ongoing";
        await program.save();
      } else if (
        endDate.isBefore(today, "day") &&
        program.programStatus !== "Completed"
      ) {
        program.programStatus = "Completed";
        await program.save();
      }
    });
  } catch (err) {
    console.error("Error updating program statuses:", err);
  }
});

const deleteCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;

    if (!collegeId) {
      return res
        .status(400)
        .json({ success: false, message: "College ID is required" });
    }

    const deletedCollege = await College.findByIdAndDelete(collegeId);

    if (!deletedCollege) {
      return res
        .status(404)
        .json({ success: false, message: "College not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();

    res.status(200).json({
      success: true,
      message: "colleges retrieved successfully.",
      colleges,
    });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching trainers.",
    });
  }
};

const addCollege = async (req, res) => {
  try {
    const { name, location, departments, phone, email } = req.body;
    console.log(req.body);

    if (!name || !location || !departments || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCollege = await College.findOne({ email });
    if (existingCollege) {
      return res
        .status(400)
        .json({ message: "A college with this email already exists" });
    }

    const departmentList =
      typeof departments === "string"
        ? departments.split(",").map((dept) => dept.trim())
        : departments;

    const newCollege = new College({
      name,
      location,
      departments: departmentList,
      phone,
      email,
      status: "active",
    });

    await newCollege.save();
    res.status(201).json({
      message: "College added successfully",
      college: newCollege,
      success: true,
    });
  } catch (error) {
    console.log("error", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ success: false, message: errors.join(", ") });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetTrainerPassword = async (req, res) => {
  try {
    const { trainerId } = req.body;

    const trainer = await Trainer.findOne({ trainerId });
    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trainer.phone, salt);

    trainer.password = hashedPassword;
    await trainer.save();

    console.log("Trainer password reset to phone number successfully");

    res.status(200).json({
      success: true,
      message: "Trainer password reset to phone number successfully",
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllProblems = async (req, res) => {
  try {
    const categories = await Category.find().populate("problems").lean();

    if (!categories || categories.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No categories found.",
        problems: [],
      });
    }

    const problems = categories.map((category) => ({
      _id: category._id,
      categoryName: category.categoryName,
      problems: category.problems || [],
    }));

    res.status(200).json({
      success: true,
      message: "Problems retrieved successfully.",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching problems",
      error: error.message,
    });
  }
};

const addProblem = async (req, res) => {
  try {
    const {
      type,
      problemName,
      platform = "",
      link = "",
      description = "",
      constraints = "",
      sampleInput = "",
      sampleOutput = "",
      manualTestCases = [],
      Duedate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      difficulty = "easy",
      categoryId,
    } = req.body.problem || {};

    if (!type || !problemName) {
      return res.status(400).json({
        success: false,
        message: "Problem type and name are required.",
      });
    }

    const newProblem = await Problem.create({
      type,
      problemName,
      platform,
      link,
      description,
      constraints,
      sampleInput,
      sampleOutput,
      manualTestCases,
      Duedate,
      difficulty,
      createdAt: new Date(),
      studentsCompleted: [],
    });

    console.log(newProblem);

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      category.problems.push(newProblem._id);
      await category.save();
    }

    res.status(201).json({
      success: true,
      message: "Problem added successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Error adding problem:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding problem",
      error: error.message,
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new Category({
      categoryName,
      problems: [],
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while adding category",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await Problem.deleteMany({ _id: { $in: category.problems } });

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      success: true,
      message: "Category and its problems deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const { problemId, categoryId } = req.body;

    if (!problemId || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Both problemId and categoryId are required",
      });
    }

    const problem = await Problem.findByIdAndDelete(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $pull: { problems: problemId } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem deleted and removed from category successfully",
    });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting problem",
      error: error.message,
    });
  }
};

const editProblem = async (req, res) => {
  try {
    const { problemId, updates } = req.body;

    const updatedProblem = await Problem.findByIdAndUpdate(problemId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProblem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  adminSignin,
  adminSignup,
  addTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  getAdmin,
  addProgram,
  getAllPrograms,
  deleteTask,
  addTask,
  editProgram,
  deleteProgram,
  addCollege,
  deleteCollege,
  getAllColleges,
  getAdmins,
  deleteAdmin,
  resetTrainerPassword,
  addProblem,
  addCategory,
  getAllProblems,
  deleteCategory,
  deleteProblem,
  editProblem,
};
