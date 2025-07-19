import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import apiurl from "../../connectivity";

const AssignTaskModal = ({ setShowAssignModal, programId, setProgramDetails, programdetails }) => {
  const [activeTab, setActiveTab] = useState("assign"); // "assign" or "manual"

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState("leetcode");
  const [link, setLink] = useState("");
const[loading,setisloading]=useState(false);
  const [qNo, setQNo] = useState("");
  const [qName, setQName] = useState("");
  const [qdescription, setqdescription] = useState("");
  const [testCases, setTestCases] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [manualTestCases, setManualTestCases] = useState([
    { input: "", output: "" },
  ]);
  
  const handleSubmit = async () => {
    if (!programId) {
      alert("Program ID is missing!");
      return;
    }
    const assigningdate = new Date().toISOString(); // send ISO formatted date
    const newTask = {
      taskName,
      description,
      date,
      platform,
      link,
      studentsCompleted: [],
      programId
    };
    setisloading(true)

    try {
      const response = await axios.post(`${apiurl}/trainer/addtask`, { programId, newTask,assigningdate });
      if (response.status === 303) {
        toast.error("Program is already completed. You cannot assign tasks in it!");
        return;
      }

      toast.success("Task added successfully");
      setProgramDetails((prev) => ({
        ...prev,
        studentTasks: [...prev.studentTasks, newTask],
      }));
      setShowAssignModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task.");
    }
  };
  
  const handleManualSubmit = async () => {
    if (!programId || !qNo || !qName ||!qdescription|| manualTestCases.length === 0) {
      toast.error("Please fill all required manual task fields.");
      return;
    }
  
    try {
      const response = await axios.post(`${apiurl}/trainer/manual-task`, {
        programId,
        qNo,
        qName,
        qdescription,
        difficulty,
        manualTestCases,
      });
  
      toast.success("Manual task added successfully.");
      setShowAssignModal(false);
    } catch (error) {
      console.error("Error adding manual task:", error);
      toast.error("Failed to add manual task.");
    }
  };
  
  const handleTestCaseChange = (index, field, value) => {
    const updated = [...manualTestCases];
    updated[index][field] = value;
    setManualTestCases(updated);
  };
  
  const addTestCase = () => {
    setManualTestCases([...manualTestCases, { input: "", output: "" }]);
  };
  
  const removeTestCase = (index) => {
    const updated = manualTestCases.filter((_, i) => i !== index);
    setManualTestCases(updated);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[700px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Assign Task</h2>

        {/* Tab headers */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "assign" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Assign Existing Task
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Create New Task Manually
          </button>
        </div>

        {/* Assign Existing Task */}
        {activeTab === "assign" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Task Title</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
                placeholder="Enter task description"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="leetcode">LeetCode</option>
                  <option value="codeforces">Codeforces</option>
                  <option value="hackerrank">HackerRank</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Problem Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter problem link"
              />
            </div>
          </div>
        )}

        {/* Create Task Manually */}
        {activeTab === "manual" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Question Number
              </label>
              <input
                type="text"
                value={qNo}
                onChange={(e) => setQNo(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Q1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Question Name</label>
              <input
                type="text"
                value={qName}
                onChange={(e) => setQName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Two Sum Problem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Question Description</label>
              <textarea
                type="text"
                value={qdescription}
                onChange={(e) => setqdescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter questions description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Cases
              </label>
              {manualTestCases.map((tc, index) => (
                <div
                  key={index}
                  className="mb-3 border rounded-lg p-3 space-y-2 bg-gray-50"
                >
                  <div>
                    <label className="text-sm font-medium">Input</label>
                    <textarea
                      value={tc.input}
                      onChange={(e) =>
                        handleTestCaseChange(index, "input", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg mt-1"
                      placeholder="Enter multi-line input"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Expected Output
                    </label>
                    <textarea
                      value={tc.output}
                      onChange={(e) =>
                        handleTestCaseChange(index, "output", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg mt-1"
                      placeholder="Enter expected output"
                      rows={3}
                    />
                  </div>
                  {manualTestCases.length > 1 && (
                    <button
                      onClick={() => removeTestCase(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addTestCase}
                className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
              >
                + Add More Test Case
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowAssignModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
  onClick={activeTab === "assign" ? handleSubmit : handleManualSubmit}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
  disabled={loading} // optional: disable button during loading
>
  {loading ? (
    <span className="flex items-center gap-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Loading...
    </span>
  ) : (
    activeTab === "assign" ? "Assign Task" : "Save Manual Task"
  )}
</button>

        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;
