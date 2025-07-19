import React from 'react'
import Sidebarstore from "../../store/sidebarstore";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authstore"
import { Bell, ChevronDown, Download, Filter, Search } from 'lucide-react';
import axios from 'axios';
import { BsCheckCircleFill, BsClockFill, BsListTask, BsCalendarEvent, BsGraphUp, BsPeople } from "react-icons/bs";
import apiurl from '../../connectivity';
const Assessment = ({navigate}) => {
    const sidebaropen = Sidebarstore((state) => state.isOpen);
    const{trainerId,email,Name}=useAuthStore();

      const[assignedprograms,setassignedprograms]=useState([]);
        const[trainerdata,settrainerdata]=useState();
         const [searchQuery, setSearchQuery] = useState("");
          const [selectedFilter, setSelectedFilter] = useState("All");
          const filterOptions = ["All", "Ongoing", "Pending", "Completed"];
         
      useEffect(()=>{
        const getdata=async()=>{
          const response=await axios.get(`${apiurl}/trainer/get-trainer`,{params:{trainerId}});
          console.log("Trainer Data:", response.data.trainer);
          if(response.data.success){
    
            settrainerdata(response.data.trainer)
            setassignedprograms(response.data.trainer.programsAssigned)
          }
    
        }
        if (trainerId) {
          getdata();
        }
    
      },[trainerId])
      const viewdetails=(programid)=>{
        navigate(`programdetails/${programid}`)
      
      }
  return (
    <div
      className={`min-h-screen bg-white transition-all duration-300 ${
        sidebaropen ? "w-full pl-[270px]" : "w-[93%] mx-auto"
      }`}
    >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Program Overview</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search programs, batches, or instructors..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select 
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  {filterOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="bg-gray-100">
        <th className="text-left text-lg font-semibold text-gray-700 p-5">Program Details</th>
        <th className="text-left text-lg font-semibold text-gray-700 p-5">Duration</th>
        <th className="text-left text-lg font-semibold text-gray-700 p-5">Students</th>
        <th className="text-left text-lg font-semibold text-gray-700 p-5">Progress</th>
        <th className="text-left text-lg font-semibold text-gray-700 p-5">Status</th>
        <th className="text-left text-lg font-semibold text-gray-700 p-5">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {assignedprograms
       
        .map((program) => (
          <tr key={program._id} className="hover:bg-gray-50 transition-all">
            <td className="p-5">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xl font-semibold text-gray-900">{program.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-lg text-gray-600">
                    <span>{program.code}</span>
                    <span className="text-gray-500">•</span>
                    <span>Updated {program.venue}</span>
                  </div>
                </div>
              </div>
            </td>

            <td className="p-5 text-lg text-gray-700">
              <div className="flex items-center gap-3">
                <BsCalendarEvent className="text-gray-500 w-6 h-6" />
                <div>
                  <p>{new Date(program.startDate).toLocaleDateString()}</p>
                  <p className="text-gray-500 text-md">to {new Date(program.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </td>

            <td className="p-5 text-lg text-gray-700">
              <div className="flex items-center gap-3">
                <BsPeople className="text-gray-500 w-6 h-6" />
                <span>{program?.students?.length ?? 0}</span>
                </div>
            </td>

            <td className="p-5">
              <div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      program.status === "Completed"
                        ? "bg-green-500"
                        : program.status === "Ongoing"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                    style={{ width: `${program.progress||0}%` }}
                  ></div>
                </div>
                <span className="text-lg text-gray-700">{program.progress ||0}% Complete</span>
              </div>
            </td>

            <td className="p-5">
              <span
                className={`px-6 py-2 rounded-full text-lg font-semibold ${
                  program.programStatus  === "Completed"
                    ? "bg-green-100 text-green-800"
                    : program.programStatus  === "Ongoing"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {program.programStatus }
              </span>
            </td>

            <td className="p-5">
              <button className="px-5 py-3 text-lg font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer" onClick={()=>viewdetails(program._id)}>
                View Details
              </button>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

        </div>
        </div>
  )
}

export default Assessment