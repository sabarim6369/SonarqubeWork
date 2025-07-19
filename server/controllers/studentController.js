const User = require("../models/studentSchema");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwt");
const Program = require("../models/programSchema");
const mongoose = require("mongoose")
const { checkCompletionStatus, checkCodingStatus } = require("./programController")
const axios = require("axios");
const category = require("../models/categorySchema")
const Problem = require("../models/problemSchema")

async function Login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email : email });
 
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.pass);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = createToken({ student_id: user.student_id, email: user.email });
    res.status(200).json({
      message: "User logged in successfully!",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

async function Signup(req, res) {
  try {

    const { username, email, password, age, gender, phone, college_id } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data received in request body" });
    }

    if (!username || !email || !password || !age || !gender || !phone || !college_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(college_id)
    const manalCollegeId = college_id === "no-college-selected" ? null : college_id;
    console.log(manalCollegeId)

    const user = new User({
      name: username,
      email: email,
      pass: hashedPassword,
      age: age,
      gender: gender,
      phone: phone,
      collegeId: manalCollegeId  ,
    });
    

    await user.save();
    res.status(200).json({ message: "User created successfully" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
}
async function getStudent(req, res) {
  try {
    const studentDoc = await User.findOne(
      { student_id: Number(req.user.student_id) },
      { pass: 0 }
    ).populate("program_id").populate("collegeId");

    if (!studentDoc) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = studentDoc.toObject(); 

    const leetcodeURL = student.platforms?.leetcode;
    if (leetcodeURL) {
      const matches = leetcodeURL.match(/leetcode\.com\/u\/([\w-]+)/);
      const leetcodeUsername = matches?.[1];

      if (leetcodeUsername) {
        const graphqlQuery = {
          query: `
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                username
                profile {
                  realName
                  ranking
                  userAvatar
                  aboutMe
                  school
                  countryName
                }
                submitStats {
                  acSubmissionNum {
                    difficulty
                    count
                    submissions
                  }
                }
              }
            }
          `,
          variables: {
            username: leetcodeUsername,
          },
        };

        try {
          const leetcodeResponse = await axios.post(
            "https://leetcode.com/graphql",
            graphqlQuery,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const leetcodeData = leetcodeResponse.data;
          if (leetcodeData?.data?.matchedUser) {
            student.leetcode = leetcodeData.data.matchedUser; 
          } else {
            student.leetcode = null;
          }
        } catch (error) {
          console.error("LeetCode fetch error:", error.message);
          student.leetcode = null;
        }
      }
    }

    res.status(200).json({ student });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

async function getCourseDetails(req,res) {
  try {
    const { courseCode } = req.query;
    try {
      const program = await Program.findOne({code : courseCode})
      if(program) {
        res.status(200).json({status : "found" , program : program})
      }else {
        res.status(200).json({status : "notFound"})
      }
    }catch(err) {
      res.status(200).json({status : "notFound"})
    }
    
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

async function setCourse(req, res) {
  try {
    const { course } = req.body;
    
    if (!course || !course._id) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const student = await User.findOne(
      { student_id: Number(req.user.student_id) },
      { pass: 0 }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const courseId = new mongoose.Types.ObjectId(course._id);

    const alreadyEnrolled = student.program_id.some(id => id.toString() === courseId.toString());

    if (!alreadyEnrolled) {
      student.program_id.push(courseId);
      await student.save();
      const program = await Program.findOne({programId : course.programId})
      program.students.push(student._id)
      program.save()
    } else {
      return res.status(200).json({ message: "Course already enrolled", student });
    }

    const updatedStudent = await User.findOne(
      { student_id: Number(req.user.student_id) },
      { pass: 0 }
    ).populate("program_id");

    res.status(200).json({ student: updatedStudent });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}


async function getCourse(req, res) {
  try {
    const { program_id } = req.query;
    const student_id = req.user.student_id;

    const user = await User.findOne({ student_id }).populate("program_id");

    if (!user) {
      return res.status(404).json({ message: "Student not found", status: "failed" });
    }

    const isEnrolled = user.program_id.some(program => program._id.toString() === program_id);

    if (!isEnrolled) {
      return res.status(403).json({ message: "You are not enrolled in this course", status: "notEnrolled" });
    }

    const program = await Program.findById(program_id).populate("trainerAssigned");

    if (!program) {
      return res.status(404).json({ message: "Course not found", status: "notFound" });
    }

    res.status(200).json({ status: "success", course : program });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

async function checkCompleted(req, res) {
  try {
    const { task, id } = req.body;
    const student_id = req.user.student_id;

    console.log(task, id);

    const student = await User.findOne({ student_id });
    const program = await Program.findById(id);

    if (!student || !program) {
      return res.status(404).json({ message: "Student or Program not found", status: "failed" });
    }

    const isUserEnrolled = student.program_id.some(p => p._id.toString() === id);
    if (!isUserEnrolled) {
      return res.status(403).json({ message: "You are not enrolled in this course", status: "notEnrolled" });
    }

    const result = await checkCompletionStatus(program, task, student);

    if (result.status === "completed") {
      const taskIndex = program.studentTasks.findIndex(
        t => t.taskName === task.taskName && new Date(t.date).toISOString() === new Date(task.date).toISOString()
      );

      if (taskIndex !== -1) {
        if (!program.studentTasks[taskIndex].studentsCompleted.includes(student._id.toString())) {
          program.studentTasks[taskIndex].studentsCompleted.push(student._id);
          await program.save();
        }
      }
    }

    return res.status(result.code).json({ message: result.message, status: result.status , course : program });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}



async function setPlatform(req,res) {
  try {
    const {platform , link} = req.body
    const student_id = req.user.student_id

    const student = await User.findOne({student_id})
    if(!student) {
      return res.status(404).json({ message: "Student not found", status: "failed" });
    }
    student.platforms = { ...student.platforms, [platform] : link}
    console.log(student)

    await student.save()
    res.status(200).json({ message: "Platform added successfully" , student : student});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

async function getCoding(req, res) {
  try {
    const student_id = req.user.student_id;
    const student = await User.findOne({ student_id });
    if (!student) {
      return res.status(404).json({ message: "Student not found", status: "failed" });
    }

    const coding = await Problem.find() // <-- fixed line

    if (!coding) {
      return res.status(404).json({ message: "Coding not found", status: "failed" });
    }

    res.status(200).json(coding);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}


async function checkCodingCompleted(req,res) {
  try {

    const {task} = req.body
    const student_id = req.user.student_id
    const student = await User.findOne({student_id})
    if(!student) {
      return res.status(404).json({ message: "Student not found", status: "failed" });
    }
    const result = await checkCodingStatus(task, student)
    
    if(result.status === "completed") {
      student.coding.push(task)
      await student.save()
      
      res.status(200).json({message : result.message , status : result.status , student : student})
    }else {
      res.status(201).json({message : result.message , status : result.status})
    }


  }catch(err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}



module.exports = {
  Login,
  Signup,
  getStudent,
  getCourseDetails,
  setCourse,
  getCourse,
  checkCompleted,
  setPlatform,
  getCoding,
  checkCodingCompleted
};
