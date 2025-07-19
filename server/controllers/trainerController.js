const Trainer = require("../models/trainerSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Program = require("../models/programSchema");
const cron = require("node-cron");
const Student=require("../models/studentSchema")

const getTrainer = async (req, res) => {
  try {
 console.log("fff")
    const trainer = await Trainer.findById(req.query.trainerId).populate("programsAssigned");

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    console.log(trainer)
    res.status(200).json({
      trainer: trainer,
      success: true
    });
  }
  catch (err) {
    res.status(500).json({ message: "Error fetching trainer" });
  }
}

const trainerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
   

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }


    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }


    const isPasswordValid = await bcrypt.compare(password, trainer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   const name=trainer.name;
    const token = jwt.sign(
      { trainerId: trainer._id, email: trainer.email,role:"Trainer",Name:name},
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      trainer: {
        email: trainer.email,
        name: trainer.name,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const getTrainerData = async (req, res) => {
  try {
    const trainerId = req.query.trainerId;
    const trainer = await Trainer.findById(trainerId).select('-password').populate("programsAssigned");
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    return res.status(200).json({
      message: "Trainer data retrieved successfully",
      success: true,
      trainer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const editTrainerData = async (req, res) => {
  try {
    const trainerId = req.query.trainerId || req.params.trainerId;
    const updates = req.body;

    if (!trainerId) {
      return res.status(400).json({ success: false, message: "Trainer ID is required" });
    }

    // Optional: prevent updating password here (you can separate password update in another route)
    if (updates.password) {
      return res.status(400).json({ success: false, message: "Password update is not allowed from this route" });
    }

    const trainer = await Trainer.findByIdAndUpdate(
      trainerId,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Trainer data updated successfully",
      trainer,
    });
  } catch (error) {
    console.error("Error updating trainer data:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const markTaskCompleted = async (req, res) => {
  const { programId, trainerId, taskId } = req.body;
console.log(req.body)

  try {

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }


    if (program.trainerAssigned.toString() !== trainerId) {
      return res.status(403).json({ success: false, message: "Trainer not assigned to this program" });
    }


    const taskIndex = program.dailyTasks.findIndex(task => task._id.toString() === taskId);


    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }


    program.dailyTasks[taskIndex].completed = true;




    await program.save();


    return res.status(200).json({ success: true, message: "Task marked as completed", program });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const markAttendance = async (req, res) => {
  const { trainerId } = req.body;
  const attendanceDate = new Date().toISOString().split("T")[0]; // Only date part
  const currentTime = new Date();

  if (!trainerId) {
    return res.status(400).json({ error: 'Trainer ID is required.' });
  }

  try {
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ success: false, error: 'Trainer not found.' });
    }

    const eightAM = new Date(attendanceDate);
    eightAM.setHours(8, 0, 0, 0);
    const tenAM = new Date(attendanceDate);
    tenAM.setHours(10, 0, 0, 0);

    let attendanceEntry = trainer.attendance.find(
      (entry) => new Date(entry.date).toDateString() === new Date(attendanceDate).toDateString()
    );

    if (attendanceEntry) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for today.' });
    }

    let status = "Absent"; // Default status

    if (currentTime >= eightAM && currentTime < tenAM) {
      status = "Present";
    } else if (currentTime >= tenAM) {
      status = "Late";
    }

    // Push new attendance entry
    trainer.attendance.push({ date: attendanceDate, status });
    await trainer.save();

    return res.status(200).json({ success: true, message: `Attendance marked as ${status}.`, trainer });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ success: false, error: 'An error occurred while marking attendance.' });
  }
};





const resetPassword = async (req, res) => {
  try {
    const { email, trainerId, newPassword, oldPassword } = req.body;

    if (!email || !trainerId || !newPassword || !oldPassword) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }


    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }


    const isMatch = await bcrypt.compare(oldPassword, trainer.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);


    trainer.password = hashedPassword;
    await trainer.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
const getprogramdata = async (req, res) => {
  try {
    const programid = req.query.id;

    if (!programid) {
      return res.status(400).json({ error: "Program ID is required" });
    }

    const programdetails = await Program.findById(programid).populate("students");

    if (!programdetails) {
      return res.status(404).json({ error: "Program not found" });
    }

    console.log("Fetched Program Details:😍😍😍😎😎❤️‍🔥❤️‍🔥❤️‍🔥", programdetails);

    res.status(200).json(programdetails);
  } catch (error) {
    console.error("Error fetching program data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addtask = async (req, res) => {
  try {
    const { programId, newTask,assigningdate } = req.body;
    console.log("Received Task Data:", req.body);

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    if (!newTask || !newTask.date || !newTask.taskName || !newTask.platform || !newTask.link || !newTask.description) {
      return res.status(400).json({ message: 'All task fields are required' });
    }
    const taskDate = new Date(newTask.date);
    const programEndDate = new Date(program.endDate);
    const assigningDateObj = new Date(assigningdate);

   
if (assigningDateObj > programEndDate) {
  console.log("✅ Task assigning date is after program end date");
  return res.status(303).json({ message: 'Task assigning date cannot be after the program end date' });
}
    if(taskDate>programEndDate){
    }
    program.studentTasks.push({
      date: newTask.date,
      taskName: newTask.taskName,
      platform: newTask.platform,
      link: newTask.link,
      studentsCompleted: [],
      description: newTask.description,
    });

    await program.save();

    res.status(200).json({ message: 'Student task added successfully', program });
  } catch (error) {
    console.error("Error in addtask:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const editTask = async (req, res) => {
  try {
    const { programId, taskId, updatedTask } = req.body;
    console.log("Received Data for Edit Task:", req.body);

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Find the task to update
    const taskIndex = program.studentTasks.findIndex((task) => task._id.toString() === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task details
    const task = program.studentTasks[taskIndex];

    // Validate and update task fields
    task.taskName = updatedTask.taskName || task.taskName;
    task.platform = updatedTask.platform || task.platform;
    task.link = updatedTask.link || task.link;
    task.description = updatedTask.description || task.description;
    task.date = updatedTask.date || task.date;

    const taskDate = new Date(task.date);
    const programEndDate = new Date(program.endDate);
const startdate=new Date(program.startDate)
    if (taskDate > programEndDate) {
      return res.status(400).json({ message: 'Task date cannot be after program end date' });
    }
    if(taskDate<startdate){
      return res.status(400).json({ message: 'Task date cannot be before program start date' });

    }

    await program.save();

    res.status(200).json({ message: 'Task updated successfully', program });
  } catch (error) {
    console.error("Error in editTask:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { programId, taskId } = req.body;
    console.log("Received Data for Delete Task:", req.body);

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const taskIndex = program.studentTasks.findIndex((task) => task._id.toString() === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove the task from the program's tasks list
    program.studentTasks.splice(taskIndex, 1);

    await program.save();

    res.status(200).json({ message: 'Task deleted successfully', program });
  } catch (error) {
    console.error("Error in deleteTask:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const createManualTask = async (req, res) => {
  const { programId, qNo, qName,qdescription, difficulty, manualTestCases,Duedate } = req.body;
console.log(qNo)
  if (!programId || !qNo || !qName || !manualTestCases || manualTestCases.length === 0) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  try {
    const program = await Program.findById(programId );

    if (!program) {
      return res.status(404).json({ message: "Program not found." });
    }

    program.studentsManualTasks.push({
      qNo,
      qName,
      qdescription,
      difficulty,
      manualTestCases,
      Duedate
    });

    await program.save();
const addedtask=program.studentsManualTasks[program.studentsManualTasks.length-1];
    res.status(200).json({ message: "Manual task added successfully.",newtask:addedtask });
  } catch (error) {
    console.error("Error adding manual task:", error);
    res.status(500).json({ message: "Server error." });
  }
};
const editManualTask = async (req, res) => {
  const { programId, qNo, qName, qdescription, difficulty, manualTestCases, Duedate,taskid } = req.body;
console.log(req.body)
  if (!programId || !qNo || !qName || !manualTestCases || manualTestCases.length === 0) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  try {
    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found." });
    }

    const taskIndex = program.studentsManualTasks.findIndex(task => task._id.toString() === taskid.toString());

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Update the task
    program.studentsManualTasks[taskIndex] = {
      ...program.studentsManualTasks[taskIndex],
      qNo,
      qName,
      qdescription,
      difficulty,
      manualTestCases,
      Duedate
    };

    await program.save();

    res.status(200).json({ message: "Manual task updated successfully." });
  } catch (error) {
    console.error("Error updating manual task:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const getmanualtasks = async (req, res) => {
  console.log("✅✅✅✅✅")
  const { programId } = req.body;

  if (!programId) {
    return res.status(400).json({ message: "Program ID is required" });
  }

  try {
    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
console.log(program);
    return res.status(200).json({ manualTasks: program.studentsManualTasks });
  } catch (error) {
    console.error("Error fetching manual tasks:", error);
    return res.status(500).json({ message: "Server error while fetching manual tasks" });
  }
};

const changepassword = async (req, res) => {
  try {
      const { trainerId, currentPassword, newPassword } = req.body;
      console.log(req.body);

      if (!trainerId || !currentPassword || !newPassword) {
          return res.status(400).json({ message: "All fields are required." });
      }

      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
          return res.status(404).json({ message: "Trainer not found." });
      }

      const isMatch = await bcrypt.compare(currentPassword, trainer.password);
      if (!isMatch) {
          console.log("Password mismatch detected! ❌");
          return res.status(401).json({ message: "Incorrect current password." });
      }

      const salt = await bcrypt.genSalt(10);
      trainer.password = await bcrypt.hash(newPassword, salt);

      await trainer.save();

      res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: "Server error." });
  }
};
const changepasswordfirsttime = async (req, res) => {
  console.log("😎😎😎😎")
  try {
    const { trainerId, newPassword, isDefaultPassword } = req.body;

    if (!trainerId) {
      return res.status(400).json({ message: 'Trainer ID is required' });
    }

    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      trainer.password = hashedPassword;
    }

    trainer.isdefaultpassword = isDefaultPassword === false ? false : trainer.isdefaultpassword;
    await trainer.save();

    res.status(200).json({
      message: newPassword ? 'Password updated successfully!' : 'Password change skipped!',
    });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Failed to update password.' });
  }
};

const getstudents = async (req, res) => {
  try {
    const students = await Student.find(); 
    if (!students.length) {
      return res.status(404).json({ success: false, message: "No students found" });
    }

    res.status(200).json({ success: true, students });
  } catch (err) {
    console.error("Error fetching stud  ents:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 const deletemanualtask = async (req, res) => {
  const { programid, taskid } = req.params;

  try {
    const program = await Program.findById(programid);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Filter out the task
    program.studentsManualTasks = program.studentsManualTasks.filter(
      (task) => task._id.toString() !== taskid
    );

    await program.save();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error" });
  }
};




const JDoodle_CLIENT_ID = '128b028d10f5952717b6d97d5b0a931d';
const JDoodle_CLIENT_SECRET = 'ca8c0215e76ec4f245398d5437a07444db0fd2c0837b0f01b76008bc5a24cc92';
const axios = require("axios");

const compilercode = async (req, res) => {
  const { script, stdin, language, versionIndex, expectedOutput } = req.body;

  try {
    // Make request to JDoodle API
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: JDoodle_CLIENT_ID,
      clientSecret: JDoodle_CLIENT_SECRET,
      script,
      stdin,
      language,
      versionIndex,
    });

    const output = response.data.output.trim();
    const cpuTime = response.data.cpuTime; // Time taken for execution (in seconds)
    const memoryUsage = response.data.memory; // Memory used (in bytes)
    const isExecutionSuccess = response.data.isExecutionSuccess; // Whether the code execution was successful

    // Normalize function to compare outputs
    const normalize = (str) => {
      try {
        const parsed = JSON.parse(str.replace(/'/g, '"'));
        return Array.isArray(parsed)
          ? JSON.stringify(parsed.map(Number))
          : JSON.stringify(parsed);
      } catch {
        return str.replace(/\s+/g, '');
      }
    };

    const success = normalize(output) === normalize(expectedOutput.trim());

    const timeComplexity = "O(n)"; // This can be dynamically set based on analysis
    const spaceComplexity = "O(1)"; // Similarly, dynamically set this based on the script
console.log(success,
  cpuTime, 
  memoryUsage, // Memory used during execution
  timeComplexity, // Placeholder for time complexity
  spaceComplexity, // Placeholder for space complexity
  isExecutionSuccess)
    // Return results
    res.json({
      input: stdin,
      expected: expectedOutput,
      actual: output,
      status: success ? '✅ Passed' : '❌ Failed',
      success,
      executionTime: cpuTime, // Time taken to execute
      memoryUsed: memoryUsage, // Memory used during execution
      timeComplexity, // Placeholder for time complexity
      spaceComplexity, // Placeholder for space complexity
      isExecutionSuccess, // Execution success status
    });

  } catch (err) {
    console.error('JDoodle API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'JDoodle API error', details: err.message });
  }
};


module.exports = { markAttendance, trainerLogin, getTrainer, getTrainerData, markTaskCompleted, resetPassword,addtask,getprogramdata,changepassword,getstudents,editTrainerData,changepasswordfirsttime,createManualTask,getmanualtasks,compilercode,deleteTask,editTask,editManualTask,deletemanualtask};
