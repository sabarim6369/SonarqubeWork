import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebarstore from "../../store/sidebarstore";
import { Calendar, Users, Code, BookOpen, Clock, Plus, Edit2, Trash2, ExternalLink, Search, Filter, ChevronDown, Bell, ChevronUp, BarChart2, Award, CheckCircle, AlertCircle, ClipboardList, X, Github, Linkedin, Mail, Phone, MapPin, Globe, FileText, Star, Briefcase,Pencil } from 'lucide-react';
import axios from 'axios';
import AssignTaskModal from "./Assigntaskmodel";
import clsx from "clsx";
import useAuthStore from "../../store/authstore"
import { toast } from "react-toastify";
import apiurl from "../../connectivity";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from "react-router-dom";

export default function Programdetails() {
  const { id } = useParams();
      const{trainerId,email,Name}=useAuthStore();
  
  const sidebaropen = Sidebarstore((state) => state.isOpen);
  const [activeTab, setActiveTab] = useState("Assignedtasks");
  const [selectedDate, setSelectedDate] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskType, setSelectedTaskType] = useState("all");
  const [programdetails, setprogramdetails] = useState();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState("leetcode");
  const [link, setLink] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const[manualtask,setmanualtasks]=useState(false);
  const filteredStudents = programdetails?.students?.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );  
  const[showmanualeditmodal,setShowmanualEditModal]=useState(false);
  const[selectedmanualtask,setselectedtaskforedition]=useState()
  const toggleCompletion = (index) => {
    const updatedTasks = [...taskList];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTaskList(updatedTasks);
  };
  const [qNo, setQNo] = useState("");
const [qName, setQName] = useState("");
const [qdescription, setqdescription] = useState("");
const [manualTestCases, setManualTestCases] = useState([]);
const [difficulty, setDifficulty] = useState("easy");
const [manualdate, setmanualdate] = useState("");

  useEffect(() => {
    if (showmanualeditmodal && selectedmanualtask) {
      setQNo(selectedmanualtask.qNo || "");
      setQName(selectedmanualtask.qName || "");
      setqdescription(selectedmanualtask.qdescription || "");
      setManualTestCases(selectedmanualtask.manualTestCases || []);
      setDifficulty(selectedmanualtask.difficulty || "easy");
      setmanualdate(selectedmanualtask.manualdate || "");
    }
  }, [showmanualeditmodal, selectedmanualtask]);
  const handleSaveTask = async () => {
    const updatedTask = {
      programId: id, // make sure this exists
      taskid:selectedmanualtask._id,
      qNo,
      qName,
      qdescription,
      manualTestCases,
      difficulty,
      Duedate: manualdate,
    };
  
    try {
      const response = await axios.post(`${apiurl}/trainer/editmanual-task`, updatedTask);
      alert(response.data.message || "Task updated successfully.");
      setShowmanualEditModal(false);
    } catch (error) {
      console.error("Error updating task:", error);
      const errMsg = error.response?.data?.message || "Failed to update task.";
      alert(errMsg);
    }
  };
  
  const handleSubmit = async () => {
    if (!programId) {
      alert("Program ID is missing!");
      return;
    }

    const newTask = {
      taskName,
      description,
      date,
      platform,
      link,
      studentsCompleted: [],
    };

    try {
      const response = await axios.post(
        `${apiurl}/trainer/addtask`,
        { id, newTask }
      );

      console.log("Task Added Successfully:", response.data);
      setShowAssignModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null);

  const handleEdit = (task) => {
    setEditedTask(task);
    console.log(task)
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditedTask(null);
  };

  const handleChange = (e) => {
    setEditedTask({
      ...editedTask,
      [e.target.name]:e.target.value
    })
  };
  const handleeditSubmit = async () => {
    try {
      const response = await axios.post(`${apiurl}/trainer/edittask`, {
        programId: id,
        taskId: editedTask._id,
        updatedTask: {
          taskName: editedTask.taskName,
          platform: editedTask.platform,
          link: editedTask.link,
          description: editedTask.description,
          date: editedTask.date,
        },
      });
  
      if (response.status === 200 && response.data.message === 'Task updated successfully') {
        setIsPopupOpen(false);
        setEditedTask(null);
        setprogramdetails(prev => ({
          ...prev,
          studentTasks: prev.studentTasks.map(task =>
            task._id === editedTask._id ? { ...task, ...editedTask } : task
          ),
        }));
      }
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning(error.response.data.message); // "Task date cannot be after program end date"
      } 
      else if(error.response && error.response.status === 403){
        
      }else {
        console.error('Error updating task:', error);
        toast.error("Something went wrong while updating the task.");
      }
    }
  };
  const handleDeleteTask=async(taskid)=>{
    try{
const response=await axios.delete(`${apiurl}/trainer/deletemanualtask/${id}/${taskid}`);
if(response.status===200){
  toast.success("Task deleted successfully");
setprogramdetails(prev=>({
  ...prev,
  studentsManualTasks:prev.studentsManualTasks.filter(task=>task._id!==taskid)
}))
  return;
}
    }
    catch(err){
      toast.success("Some error occurred");

    }
  }
  
  
  const programData = {
    id: "PRG001",
    name: "MERN Stack Development",
    description: "Complete MERN Stack Development course covering MongoDB, Express.js, React, and Node.js with real-world projects and industry best practices",
    instructor: "Sarah Wilson",
    startDate: "2024-02-26",
    endDate: "2024-05-26",
    progress: 65,
    totalStudents: 25,
    completionRate: 78,
    averageScore: 85,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    metrics: {
      assignments: { completed: 156, total: 200 },
      attendance: 92,
      projectSubmissions: 45,
      codeReviews: 78
    }
  };


  useEffect(() => {
    const getdatawithid = async () => {
      console.log(id);
      const response = await axios.get(`${apiurl}/trainer/getprogramdata`, {
        params: { id }
      });
      console.log(response.data);
      setprogramdetails(response.data);
    };
    getdatawithid();
  }, [id]);

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setOpenProfileModal(true);
  };
  
  

const handleDelete = async (task) => {
  console.log("Deleting task:", task);

  const isConfirmed = window.confirm("Are you sure you want to delete this task?");
  
  if (!isConfirmed) return;

  try {
    const response = await axios.delete(`${apiurl}/trainer/deletetask`, {
      data: {
        programId: id, 
        taskId: task._id,  
      },
    });
    setprogramdetails((prev) => ({
      ...prev,
      studentTasks: prev.studentTasks.filter((t) => t._id !== task._id),
    }));
    console.log("Task deleted:", response.data);
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task. Please try again.");
  }
};

const handleTestCaseChange = (index, field, value) => {
  const updated = [...manualTestCases];
  updated[index][field] = value;
  setManualTestCases(updated);
};

  const markAsCompleted = async (taskId) => {
    try {
      const response = await axios.post(
        `${apiurl}/trainer/mark-task-completed`,
        { taskId, programId: id, trainerId }
      );
  
      if (response.status === 200) {
        toast.success("Task completed successfully");
  
        setprogramdetails((prev) => ({
          ...prev,
          dailyTasks: prev.dailyTasks.map((task) =>
            task._id === taskId ? { ...task, completed: true } : task
          ),
        }));
      } else {
        toast.error(response.data.message || "Failed to mark task as completed");
      }
    } catch (error) {
      console.error("Error marking task as completed:", error);
      toast.error(
        error.response?.data?.message || "An error occurred, please try again."
      );
    }
  };
  const hadleshowall=()=>{
    setSelectedDate("");
    setmanualtasks(false);
  }
  const handlefilter=(e)=>{
    setmanualtasks(false);
setSelectedTaskType(e.target.value)

  }
  const handleEditTask=(task)=>{
    setShowmanualEditModal(true);
    setselectedtaskforedition(task);
  }
  const addTestCase = () => {
    setManualTestCases([...manualTestCases, { input: "", output: "" }]);
  };
  const removeTestCase=(index)=>{
    const updated=manualTestCases.filter((_,i)=>i!=index);
    setManualTestCases(updated);

  }
  const StudentProfileModal = () => {
    if (!selectedStudent) return null;

    const studentData = {
      ...selectedStudent,
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      bio: "Passionate software developer with a focus on web technologies. Currently learning MERN stack development and exploring cloud solutions.",
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "HTML/CSS", "Git"],
      education: [
        {
          institution: "University of Technology",
          degree: "Bachelor of Science in Computer Science",
          year: "2018-2022"
        }
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built a full-stack e-commerce platform with React, Node.js, and MongoDB",
          link: "https://github.com/student/ecommerce"
        },
        {
          name: "Task Management App",
          description: "Developed a task management application with real-time updates using Socket.io",
          link: "https://github.com/student/taskmanager"
        }
      ],
      socialLinks: {
        github: "https://github.com/student",
        linkedin: "https://linkedin.com/in/student",
        portfolio: "https://student-portfolio.com"
      },
      completedCourses: [
        "Introduction to Web Development",
        "Advanced JavaScript",
        "React Fundamentals"
      ],
      achievements: [
        "Hackathon Winner - Best UI/UX (2023)",
        "Top Performer in Data Structures Course",
        "Open Source Contributor"
      ]
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto ">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar ">
          <div className="relative">
            <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl relative">
              <button 
                onClick={() => setOpenProfileModal(false)}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
              >
                <X className="w-6 h-6 text-black cursor-pointer" />
              </button>
            </div>
            
            <div className="absolute top-24 left-8 border-4 border-white rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60" 
                alt={studentData.name} 
                className="w-32 h-32 object-cover"
              />
            </div>
          </div>
          
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{studentData.name}</h2>
                <p className="text-gray-600 text-lg">{studentData.email}</p>
              </div>
              <div className="flex gap-3">
                <a href={studentData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Github className="w-5 h-5 text-gray-700" />
                </a>
                <a href={studentData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Linkedin className="w-5 h-5 text-gray-700" />
                </a>
                <a href={`mailto:${studentData.email}`} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Mail className="w-5 h-5 text-gray-700" />
                </a>
                <a href={studentData.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Globe className="w-5 h-5 text-gray-700" />
                </a>
              </div>
            </div>
            
            {/* Contact info */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>{studentData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{studentData.location}</span>
              </div>
            </div>
            
            {/* Bio */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">About</h3>
              <p className="text-gray-600">{studentData.bio}</p>
            </div>
            
            {/* Progress in current program */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Program Progress</h3>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Overall Completion</span>
                  <span className="font-medium">{studentData.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${studentData.progress || 0}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Completed Tasks</p>
                      <p className="text-xl font-semibold">{studentData.completedTasks || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Pending Tasks</p>
                      <p className="text-xl font-semibold">{studentData.pendingTasks || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Code className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">LeetCode Problems</p>
                      <p className="text-xl font-semibold">{studentData.leetcodeProblems || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">CodeChef Rating</p>
                      <p className="text-xl font-semibold">{studentData.codechefRating || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {studentData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Education */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Education</h3>
              {studentData.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-medium text-gray-900">{edu.institution}</h4>
                  <p className="text-gray-600">{edu.degree}</p>
                  <p className="text-gray-500 text-sm">{edu.year}</p>
                </div>
              ))}
            </div>
            
            {/* Projects */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentData.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">{project.name}</h4>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Achievements */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h3>
              <ul className="space-y-2">
                {studentData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Completed Courses */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Completed Courses</h3>
              <ul className="space-y-2">
                {studentData.completedCourses.map((course, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-gray-700">{course}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditProgramModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Edit Program</h2>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-100">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold">Delete Task</h2>
        </div>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-white transition-all duration-300 ${
        sidebaropen ? "w-full pl-[270px]" : "w-[93%] mx-auto"
      }`}
    >
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={programData.thumbnail}
                alt={programData.name}
                className="w-20 h-20 rounded-xl object-cover shadow-lg"
              />
              <div>
                <div className="flex justify-between">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {programdetails?.name}
                  </h1>
                </div>
                <p className="text-lg text-gray-500 mt-2">
                  {programdetails?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-gray-500 mt-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-lg">
                  {programdetails?.students?.length} Students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">
                  {programdetails?.startDate
                    ? new Date(programdetails.startDate).toLocaleDateString()
                    : ""}
                  -
                  {programdetails?.endDate
                    ? new Date(programdetails.endDate).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-lg">
                  {programdetails?.progress || 0}% Complete
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative"></div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("Assignedtasks")}
            className={`px-8 py-4 text-lg font-medium transition-colors rounded-t-lg ${
              activeTab === "Assignedtasks"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Assigned Tasks
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-8 py-4 text-lg font-medium transition-colors rounded-t-lg ${
              activeTab === "students"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-8 py-4 text-lg font-medium transition-colors rounded-t-lg ${
              activeTab === "tasks"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Student tasks
          </button>
        </div>

        {activeTab === "students" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Enrolled Students</h2>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="px-4 py-2 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left text-sm font-semibold text-gray-600 p-4 rounded-tl-xl">
                        Student
                      </th>
                      <th className="text-left text-sm font-semibold text-gray-600 p-4">
                        Progress
                      </th>
                      <th className="text-left text-sm font-semibold text-gray-600 p-4">
                        LeetCode
                      </th>
                      <th className="text-left text-sm font-semibold text-gray-600 p-4">
                        CodeChef
                      </th>
                      <th className="text-left text-sm font-semibold text-gray-600 p-4">
                        Tasks
                      </th>
                      <th className="text-left text-sm font-semibold text-gray-600 p-4 rounded-tr-xl">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60"
                              alt={student.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-lg">
                                {student.name}
                              </p>
                              <p className="text-gray-500">{student.email}</p>
                              <div className="flex gap-2 mt-1"></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${student.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600">
                              {student.progress || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Code className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">
                              {student.leetcodeProblems || 0} solved
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">
                              Rating: {student.codechefRating || 0}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600">
                                {student.completedTasks} completed
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-yellow-500" />
                              <span className="text-yellow-600">
                                {student.pendingTasks} pending
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <button
                            className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleViewProfile(student)}
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={hadleshowall}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 text-lg"
                >
                  Show All
                </button>
                <button
                  onClick={() => setmanualtasks(true)}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 text-lg"
                >
                  Show Manual tasks
                </button>
                <select
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedTaskType}
                  onChange={(e) => handlefilter(e)}
                >
                  <option value="all">All Types</option>
                  <option value="assignment">Assignments</option>
                  <option value="challenge">Coding Challenges</option>
                  <option value="project">Projects</option>
                </select>
              </div>
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 text-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>

            {manualtask ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {programdetails?.studentsManualTasks?.map((task) => (
                  <div key={task._id} className="relative group">
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={() => handleEditTask(task)}
                        title="Edit Task"
                      >
                        <Pencil
                          size={20}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        title="Delete Task"
                      >
                        <Trash2
                          size={20}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        />
                      </button>
                    </div>

                    <Link to={`/task/${task._id}/${id}`}>
                      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow h-full flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-blue-800 mb-2">
                            Q{task.qNo}: {task.qName}
                          </h3>

                          {task.qdescription && (
                            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                              {task.qdescription}
                            </p>
                          )}

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <strong className="text-gray-800">
                                Difficulty:
                              </strong>{" "}
                              <span className="capitalize">
                                {task.difficulty}
                              </span>
                            </p>
                            {task.Duedate && (
                              <p>
                                <strong className="text-gray-800">
                                  Due Date:
                                </strong>{" "}
                                {new Date(task.Duedate).toLocaleDateString()}
                              </p>
                            )}
                            <p>
                              <strong className="text-gray-800">
                                Created At:
                              </strong>{" "}
                              {new Date(task.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Manual Test Cases
                          </h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scroll">
                            {task.manualTestCases?.map((testCase, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-700 shadow-sm"
                              >
                                <p>
                                  <strong>Input:</strong> {testCase.input}
                                </p>
                                <p>
                                  <strong>Output:</strong> {testCase.output}
                                </p>
                                <p
                                  className={`italic ${
                                    testCase.isHidden
                                      ? "text-red-500"
                                      : "text-green-600"
                                  }`}
                                >
                                  {testCase.isHidden ? "Hidden" : "Visible"}{" "}
                                  Test Case
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              // Show regular student tasks grouped by date
              programdetails &&
              Object.entries(
                programdetails.studentTasks
                  .filter((task) =>
                    selectedDate
                      ? new Date(task.date).toISOString().split("T")[0] ===
                        selectedDate
                      : true
                  )
                  .filter(
                    (task) =>
                      selectedTaskType === "all" ||
                      task.type === selectedTaskType
                  )
                  .reduce((acc, task) => {
                    const taskDate = new Date(task.date)
                      .toISOString()
                      .split("T")[0];
                    if (!acc[taskDate]) acc[taskDate] = [];
                    acc[taskDate].push(task);
                    return acc;
                  }, {})
              ).map(([date, tasks]) => (
                <div key={date} className="bg-gray-50 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    {new Date(date).toDateString()}
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    {tasks.map((task, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow relative"
                      >
                        {/* Edit and Delete Icons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={() => handleEdit(task)}
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(task)}
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {task.taskName}
                            </h3>
                            <p className="text-gray-600 text-lg">
                              {task.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-5 h-5" />
                            <span>
                              Due: {new Date(task.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Code className="w-5 h-5" />
                            <span>{task.platform}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <button
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            onClick={() => window.open(task.link, "_blank")}
                          >
                            View Problem
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Assignedtasks" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setSelectedDate("")}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 text-lg"
                >
                  Show All
                </button>
                <select
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedTaskType}
                  onChange={(e) => setSelectedTaskType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="assignment">Assignments</option>
                  <option value="challenge">Coding Challenges</option>
                  <option value="project">Projects</option>
                </select>
              </div>
            </div>

            {programdetails &&
              Object.entries(
                programdetails.dailyTasks
                  .filter((task) =>
                    selectedDate
                      ? new Date(task.date).toISOString().split("T")[0] ===
                        selectedDate
                      : true
                  )
                  .filter(
                    (task) =>
                      selectedTaskType === "all" ||
                      task.type === selectedTaskType
                  )
                  .reduce((acc, task) => {
                    const taskDate = new Date(task.date)
                      .toISOString()
                      .split("T")[0];
                    if (!acc[taskDate]) acc[taskDate] = [];
                    acc[taskDate].push(task);
                    return acc;
                  }, {})
              ).map(([date, tasks]) => (
                <div key={date} className="bg-gray-50 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    {new Date(date).toDateString()}
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    {tasks.map((task, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow relative"
                      >
                        <span
                          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${
                            task.completed
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </span>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {task.taskName}
                            </h3>
                            <p className="text-gray-600 text-lg">
                              {task.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-5 h-5" />
                            <span>
                              Due: {new Date(task.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {!task.completed && (
                          <button
                            onClick={() => markAsCompleted(task._id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {showEditModal && <EditProgramModal />}
      {showDeleteModal && <DeleteConfirmationModal />}
      {showAssignModal && (
        <AssignTaskModal
          setShowAssignModal={setShowAssignModal}
          programId={id}
          setProgramDetails={setprogramdetails}
          programdetails={programdetails}
        />
      )}
      {openProfileModal && <StudentProfileModal />}
      {isPopupOpen && editedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Edit Task
            </h2>

            {/* Task Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Task Title
              </label>
              <input
                type="text"
                name="taskName"
                value={editedTask.taskName}
                onChange={handleChange}
                placeholder="Enter task title"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* Due Date */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="date"
                value={
                  editedTask.date
                    ? new Date(editedTask.date).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Platform
              </label>
              <select
                name="platform"
                value={editedTask.platform}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="leetcode">Leetcode</option>
                <option value="codeforces">Codeforces</option>
                <option value="hackerrank ">HackerRank</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Problem Link
              </label>
              <input
                type="url"
                name="link"
                value={editedTask.link}
                onChange={handleChange}
                placeholder="Enter problem link"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-4">
              <button
                className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none transition duration-200"
                onClick={handleClosePopup}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition duration-200"
                onClick={handleeditSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
     {showmanualeditmodal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 md:mx-auto overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">
        ✏️ Edit Manual Task
      </h2>

      {/* Question Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Question Number
          </label>
          <input
            type="text"
            value={qNo}
            onChange={(e) => setQNo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Q1"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Question Name
          </label>
          <input
            type="text"
            value={qName}
            onChange={(e) => setQName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Two Sum Problem"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Question Description
        </label>
        <textarea
          value={qdescription}
          onChange={(e) => setqdescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter question description"
          rows={4}
        />
      </div>

      {/* Manual Test Cases */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            🧪 Manual Test Cases
          </h3>
          <button
            onClick={addTestCase}
            className="text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add Test Case
          </button>
        </div>

        <div className="space-y-5">
          {manualTestCases.map((tc, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Input
                  </label>
                  <textarea
                    value={tc.input}
                    onChange={(e) =>
                      handleTestCaseChange(index, "input", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl"
                    rows={3}
                    placeholder="Multi-line input"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Expected Output
                  </label>
                  <textarea
                    value={tc.output}
                    onChange={(e) =>
                      handleTestCaseChange(index, "output", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl"
                    rows={3}
                    placeholder="Expected output"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Is Hidden?
                  </label>
                  <select
                    value={tc.isHidden ? "true" : "false"}
                    onChange={(e) =>
                      handleTestCaseChange(
                        index,
                        "isHidden",
                        e.target.value === "true"
                      )
                    }
                    className="px-3 py-1 border border-gray-300 rounded-lg"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                {manualTestCases.length > 1 && (
                  <button
                    onClick={() => removeTestCase(index)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            value={manualdate}
            onChange={(e) => setmanualdate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowmanualEditModal(false)}
          className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveTask}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}