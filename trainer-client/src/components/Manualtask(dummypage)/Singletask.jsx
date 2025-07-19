import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import apiurl from '../../connectivity';
import Sidebarstore from '../../store/sidebarstore';
import { Loader2, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const languageOptions = [
  { name: 'C++', lang: 'cpp17', versionIndex: '0' },
  { name: 'C', lang: 'c', versionIndex: '0' },
  { name: 'Java', lang: 'java', versionIndex: '4' },
  { name: 'Python', lang: 'python3', versionIndex: '3' },
  { name: 'JavaScript', lang: 'nodejs', versionIndex: '4' },
];

const SingleTask = () => {
  const { id ,programid} = useParams();
  console.log(id,'🤣🤣🤣🤣🤣')
  const sidebaropen = Sidebarstore((state) => state.isOpen);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [allPassed, setAllPassed] = useState(false);
  const [customTestCase, setCustomTestCase] = useState(""); // State for custom test case
  const [showCustomInput, setShowCustomInput] = useState(false); // Show input field for custom test case
  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [completeresponse, setcompleteresponse] = useState();
  
  useEffect(() => {
    switch (language.lang) {
      case "cpp17":
        setCode(
          `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`
        );
        break;
      case "c":
        setCode(
          `#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}`
        );
        break;
      case "java":
        setCode(
          `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
        );
        break;
      case "python3":
        setCode(`# Your code here\n`);
        break;
      case "nodejs":
        setCode(`// Your code here\nconsole.log("Hello World");`);
        break;
      default:
        setCode("// Start coding here...");
    }
  }, [language]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.post(`${apiurl}/trainer/getmanualtasks`, {
          programId: programid,
        });
        const found = response.data.manualTasks.find((t) => t._id === id);
        setTask(found);
      } catch (err) {
        console.error("Error loading task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);
const[timetaken,settimetaken]=useState();
const[spacetaken,setspacetaken]=useState();
  const runCode = async () => {
    setIsSubmitted(false)
    if (!task) return;
    setIsRunning(true);
    setOutput("Running...");
    setAllPassed(false);

    try {
      console.log("🤣🤣🤣🤣🤣🤣");
      const unhiddentestcase =
        task?.manualTestCases?.filter((t) => !t.isHidden) || [];

      const response = await axios.post(`http://localhost:8001/run`, {
        code: code,
        input: "", // Can be ignored or used if needed
        lang: language.lang,
        testCases: unhiddentestcase,
      });
      console.log("🤣🤣🤣🤣🤣🤣🎉🎉🎉🎉🎉",response);

      const { outputArr, passedTestCases, totalTestCases,memoryUsedMB,executionTimeMs } = response.data;
      if(totalTestCases-passedTestCases===-1){
  setOutput("No testcase has been passed")
      }
settimetaken(executionTimeMs)
setspacetaken(memoryUsedMB)
      const resultText = outputArr
        .map((test, index) => {
          const passed = test.output.trim() === test.expectedOutput.trim();
          return `#${index + 1}
  Input:
  ${test.testcase}
  
  Expected: ${test.expectedOutput}
  Got: ${test.output}
  Status: ${passed ? "✅ Passed" : "❌ Failed"}
  ---------------------`;
        })
        .join("\n\n");

      setOutput(resultText);
      setAllPassed(passedTestCases === totalTestCases);
      setPassCount(passedTestCases);
      setFailCount(totalTestCases - passedTestCases);
    } catch (err) {
      console.error(err);
      setOutput("Error running code.");
    } finally {
      setIsRunning(false);
    }
  };
  const [showFailed, setShowFailed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const[issubmitlaoding,setsubmitloading]=useState(false);
  const handleSubmit = async () => {
    if (!task) return;
    setsubmitloading(true);
    setAllPassed(false);
    setIsSubmitted(false);
    setShowFailed(false);
  
    try {
      const hiddentestcase = task?.manualTestCases?.filter(t => t.isHidden) || [];
  
      const response = await axios.post(`http://localhost:8001/run`, {
        code,
        input: "",
        lang: language.lang,
        testCases: hiddentestcase,
      });
      const { outputArr = [], passedTestCases = 0, totalTestCases = 0 } = response.data || {};
      const allPassed = passedTestCases === totalTestCases;
  
      const resultText = outputArr
        .map((test, index) => {
          try {
            const passed = test.output.trim() === test.expectedOutput.trim();
            return `#${index + 1}
  Input:
  ${test.testcase}
  
  Expected: ${test.expectedOutput}
  Got: ${test.output}
  Status: ${passed ? "✅ Passed" : "❌ Failed"}
  ---------------------`;
          } catch {
            return `#${index + 1} - Error processing test case`;
          }
        })
        .join("\n\n");
  
      setOutput(resultText);

      setAllPassed(allPassed);
      setPassCount(passedTestCases);
      setFailCount(totalTestCases - passedTestCases);
      setIsSubmitted(true);
      setsubmitloading(false);
      if (allPassed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 7000); 
      }
      

    } catch (err) {
      console.error("Submit failed:", err);
      alert("Submission failed.");
    }
  };
  
  
  if (loading) return <p className="p-4">Loading...</p>;
  if (!task) return <p className="p-4">Task not found.</p>;

  return (
    <div
      className={clsx(
        "min-h-screen px-8 py-10 transition-all duration-300 ",
        sidebaropen ? "pl-[270px]" : "w-[100%] mx-auto",
        "bg-gradient-to-br from-indigo-50 via-white to-slate-100"
      )}
    >
      {showConfetti && (
        <>
          <Confetti
            width={width}
            height={height}
            numberOfPieces={2000}
            recycle={true}
          />
          <div className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center z-50">
            <div className="bg-white text-green-600 text-3xl font-bold p-6 rounded-lg shadow-lg border-2 border-green-400 animate-bounce">
              ✅ Submitted Successfully!
            </div>
          </div>
        </>
      )}

      <div
        className={`flex justify-between gap-3 ${
          sidebaropen ? "pl-5" : "pl-10"
        }`}
      >
        <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] h-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Q{task.qNo}: <span className="text-indigo-600">{task.qName}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Difficulty:{" "}
              <span className="text-gray-700 font-medium capitalize">
                {task.difficulty}
              </span>
            </p>
          </div>

          {/* Description */}
          <div className="text-base text-gray-800 leading-relaxed tracking-wide px-2">
            {task.qdescription}
          </div>

          {/* Test Cases */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Test Cases
              </h2>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-sm text-indigo-600 hover:underline"
              >
                {showCustomInput ? "Hide" : "Add"} Custom Test Case
              </button>
            </div>

            <div className="space-y-4">
              {task.manualTestCases
                .filter((t) => !t.isHidden)
                .map((t, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition"
                  >
                    <p className="text-sm text-slate-800 mb-2 whitespace-pre-wrap">
                      <strong className="text-blue-600">Input:</strong>
                      <br />
                      {t.input}
                    </p>
                    <p className="text-sm text-emerald-700 whitespace-pre-wrap">
                      <strong>Expected Output:</strong>
                      <br />
                      {t.output}
                    </p>
                  </div>
                ))}

              {showCustomInput && (
                <input
                  type="text"
                  value={customTestCase}
                  onChange={(e) => setCustomTestCase(e.target.value)}
                  placeholder="Enter custom input"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              )}
            </div>
          </section>
        </div>

        <div className="w-[60%] h-full p-4 rounded shadow bg-white">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <label className="font-semibold text-gray-800 text-lg">
              Select Language
            </label>
            <select
              value={language.lang}
              onChange={(e) =>
                setLanguage(
                  languageOptions.find((l) => l.lang === e.target.value)
                )
              }
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-md bg-white text-gray-700 transition-all focus:ring-2 focus:ring-indigo-500"
            >
              {languageOptions.map((lang) => (
                <option key={lang.lang} value={lang.lang}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Code Editor */}
          <div>
            <label className="block font-semibold text-gray-800 mb-3 text-lg">
              Code Editor
            </label>
            <textarea
              rows={14}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-6 rounded-xl font-mono text-base border border-gray-300 shadow-inner bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />

            <div className="flex gap-6 justify-end mt-6">
              <button
                onClick={runCode}
                disabled={isRunning}
                className={clsx(
                  "flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all cursor-pointer",
                  isRunning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                )}
              >
                {isRunning ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
                {isRunning ? "Running..." : "Run Code"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={!allPassed}
                className={clsx(
                  "flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all cursor-pointer",
                  !allPassed
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                )}
              >
                {issubmitlaoding ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle className="h-6 w-6" />
                )}

                {issubmitlaoding ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {/* Output */}
          {!isSubmitted && (
            <div className="mt-8 rounded-md border border-gray-200 bg-white shadow-sm text-sm">
              <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <span>Output</span>
                <div className="flex gap-4 text-xs text-gray-700">
                  <span className="text-green-600 font-semibold">
                    Passed: {passCount}
                  </span>
                  <span className="text-red-500 font-semibold">
                    Failed: {failCount}
                  </span>
                </div>
              </div>
              <pre className="px-4 py-3 whitespace-pre-wrap text-gray-800 font-mono text-sm">
                {output}
              </pre>
            </div>
          )}
          {isSubmitted && allPassed ? (
           <div className="mt-8 p-4 border border-green-300 bg-green-50 rounded-md shadow-sm text-green-700 text-sm font-semibold space-y-2">
           <div>🎉 All Hidden Test Cases Passed. Task Submitted Successfully!</div>
           <div className="text-green-800 font-medium text-xs">
             ⏱ Time Taken: <span className="font-bold">{timetaken} ms</span>
           </div>
           <div className="text-green-800 font-medium text-xs">
             💾 Memory Used: <span className="font-bold">{spacetaken} MB</span>
           </div>
         </div>
          ) : isSubmitted ? (
            <div className="mt-8 p-4 border border-red-300 bg-red-50 rounded-md shadow-sm text-red-700 text-sm font-semibold flex justify-between items-center">
              ❌ Some Hidden Test Cases Failed.
              <button
                onClick={() => setShowFailed(!showFailed)}
                className="ml-4 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                {showFailed
                  ? "Hide Failed Test Cases"
                  : "View Failed Test Cases"}
              </button>
            </div>
          ) : null}

          {showFailed && (
            <div className="mt-4 rounded-md border border-gray-200 bg-white shadow-sm text-sm">
              <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <span>Output</span>
                <div className="flex gap-4 text-xs text-gray-700">
                  <span className="text-green-600 font-semibold">
                    Passed: {passCount}
                  </span>
                  <span className="text-red-500 font-semibold">
                    Failed: {failCount}
                  </span>
                </div>
              </div>
              <pre className="px-4 py-3 whitespace-pre-wrap text-gray-800 font-mono text-sm">
                {output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleTask;
