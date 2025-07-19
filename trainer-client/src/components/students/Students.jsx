import React from 'react'
import Sidebarstore from "../../store/sidebarstore";
import { Calendar, Users, Code, BookOpen, Clock, Plus, Edit2, Trash2, ExternalLink, Search, Filter, ChevronDown, Bell, ChevronUp, BarChart2, Award, CheckCircle, AlertCircle, ClipboardList, X, Github, Linkedin, Mail, Phone, MapPin, Globe, FileText, Star, Briefcase } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from "react";
import apiurl from '../../connectivity';
const Students = () => {
        const sidebaropen = Sidebarstore((state) => state.isOpen);
      const [searchQuery, setSearchQuery] = useState("");
      const[students,setstudents]=useState([]);
      const [selectedStudent, setSelectedStudent] = useState(null);
      const [openProfileModal, setOpenProfileModal] = useState(false);

    useEffect(() => {
      const getstudents = async () => {
        console.log("😍😍😍😍😍");
        const response = await axios.get(
          `${apiurl}/trainer/allstudents`
        );
        console.log(response.data.students)
        setstudents(response.data.students);
      };
      getstudents();
    }, []);
    const handleViewProfile = (student) => {
        setSelectedStudent(student);
        setOpenProfileModal(true);
      };
      const filteredstudents=students.filter((student)=>{
        return student.name.toLowerCase().includes(searchQuery.toLowerCase())

      })
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
                    alt={selectedStudent.name} 
                    className="w-32 h-32 object-cover"
                  />
                </div>
              </div>
              
              <div className="pt-20 px-8 pb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedStudent.name}</h2>
                    <p className="text-gray-600 text-lg">{selectedStudent.email}</p>
                  </div>
                  <div className="flex gap-3">
                    <a href={studentData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <Github className="w-5 h-5 text-gray-700" />
                    </a>
                    <a href={studentData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <Linkedin className="w-5 h-5 text-gray-700" />
                    </a>
                    <a href={`mailto:${selectedStudent.email}`} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
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
                    <span>{selectedStudent.phone}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{selectedStudent.location}</span>
                  </div> */}
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
  return (
    <div
    className={`min-h-screen bg-white transition-all duration-300 ${
      sidebaropen ? "w-full pl-[270px]" : "w-[93%] mx-auto"
    }`}>
           <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Students</h2>
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
                    {filteredstudents
                      .map((student) => (
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
          {openProfileModal && <StudentProfileModal />}

    </div>


)
}

export default Students