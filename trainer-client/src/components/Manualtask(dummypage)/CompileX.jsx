import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebarstore from '../../store/sidebarstore';
import apiurl from '../../connectivity';
const TaskRunner = ({ id }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQIndex, setSelectedQIndex] = useState(0);
  const [code, setCode] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.post(`${apiurl}/trainer/getmanualtasks`, {
          programId: '6803f02f73843be2fc89646a',
        });
        const found = response.data.manualTasks.find((t) => t._id === id);
        setTask(found);
      } catch (err) {
        console.error('Error loading task:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleRunCode = async () => {
    const question = task.studentsManualTasks[selectedQIndex];

    try {
      const res = await axios.post(`${apiurl}/compile`, {
        code,
        language: 'cpp',
        testCases: question.manualTestCases,
      });
      setResults(res.data.results);
    } catch (error) {
      console.error('Compilation error:', error);
      setResults([{ result: 'Error compiling or running code.' }]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>No task found.</div>;

  const question = task.studentsManualTasks[selectedQIndex];

  return (
      <div
         className={clsx(
           "min-h-screen px-8 py-10 transition-all duration-300 ",
           sidebaropen ? "pl-[270px]" : "w-[100%] mx-auto",
           "bg-gradient-to-br from-indigo-50 via-white to-slate-100"
         )}
       >
      <h2>Manual Coding Task</h2>

      <select onChange={(e) => setSelectedQIndex(e.target.value)} value={selectedQIndex}>
        {task.map((q, index) => (
          <option key={q.qNo} value={index}>
            Q{q.qNo}: {q.qName}
          </option>
        ))}
      </select>

      <h3>{question.qName}</h3>
      <p><strong>Description:</strong> {question.qdescription}</p>
      <p><strong>Difficulty:</strong> {question.difficulty}</p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        cols={60}
        placeholder="Write your C++ code here"
      />

      <br />
      <button onClick={handleRunCode}>Run Code</button>

      {results.length > 0 && (
        <div>
          <h3>Test Case Results</h3>
          {results.map((res, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <strong>Test {index + 1}:</strong> {res.result}<br />
              <strong>Input:</strong> {res.input}<br />
              <strong>Expected:</strong> {res.expected}<br />
              <strong>Output:</strong> {res.actual}<br />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskRunner;
