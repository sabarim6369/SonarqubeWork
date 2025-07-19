import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiurl from '../../connectivity';
import Sidebarstore from "../../store/sidebarstore";
import { Link } from "react-router-dom";

const Task = () => {
  const sidebaropen = Sidebarstore((state) => state.isOpen);
  const [manualTasks, setManualTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const programId = "6803f02f73843be2fc89646a";

  useEffect(() => {
    const fetchManualTasks = async () => {
      try {
        const response = await axios.post(`${apiurl}/trainer/getmanualtasks`, { programId });
        setManualTasks(response.data.manualTasks || []);
      } catch (error) {
        console.error("Failed to fetch manual tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManualTasks();
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 py-10 px-6 bg-gradient-to-br from-blue-50 to-gray-100 ${sidebaropen ? "pl-[270px]" : "w-[93%] mx-auto"}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">📘 Manual Coding Tasks</h2>

        {loading ? (
          <p className="text-gray-600">Loading tasks...</p>
        ) : manualTasks.length === 0 ? (
          <p className="text-gray-500 text-base">No tasks found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {manualTasks.map((task) => (
              <Link to={`/task/${task._id}`} key={task._id}>
                <div className="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition cursor-pointer">
                  <h3 className="text-lg font-semibold text-blue-700 mb-1">Q{task.qNo}: {task.qName}</h3>
                  <p className="text-sm text-gray-600">
                    Difficulty: <span className="font-medium text-gray-800 capitalize">{task.difficulty}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
