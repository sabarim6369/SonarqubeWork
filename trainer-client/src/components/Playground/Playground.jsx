import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import axios from 'axios';
import Sidebarstore from "../../store/sidebarstore";
import clsx from 'clsx';
import apiurl from '../../connectivity';

const Playground = () => {
  // Default code templates for each language
  const defaultCodeTemplates = {
    python3: "print('Hello World')",
    javascript: "console.log('Hello World');",
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
  };

  const [language, setLanguage] = useState('python3');
  const [code, setCode] = useState(defaultCodeTemplates[language]);
  const [output, setOutput] = useState('');
  const sidebaropen = Sidebarstore((state) => state.isOpen);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(defaultCodeTemplates[selectedLanguage]); // Reset code when changing language
  };
  const languageMap = {
    python3: 71,     // Python (3.8.1)
    javascript: 63,  // JavaScript (Node.js 12.14.0)
    cpp: 54,         // C++ (G++ 9.2.0)
    java: 62         // Java (OpenJDK 13.0.1)
  };
  
  const runCode = async () => {
    try {
      const res = await axios.post(`${apiurl}/run`, {
        language: language,
        code,
      });

      if (res.data.run && res.data.run.stderr) {
        setOutput(`Error: ${res.data.run.stderr}`);
      } else {
        setOutput(res.data.run.output || "No output");
      }
    } catch (err) {
      setOutput('Error running code');
      console.error(err);
    }
  };

  const getLanguageExtension = () => {
    switch (language) {
      case 'python3':
        return [python()];
      case 'javascript':
        return [javascript()];
      case 'cpp':
        return [cpp()];
      case 'java':
        return [java()];
      default:
        return [python()];
    }
  };

  return (
    <div
      className={clsx(
        "min-h-screen px-8 py-10 transition-all duration-300 bg-gradient-to-br from-indigo-50 via-white to-slate-100",
        sidebaropen ? "pl-[270px]" : "w-[100%] mx-auto"
      )}
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Code Playground</h2>

        {/* Language Selector */}
        <div className="mb-6">
          <label htmlFor="language" className="mr-2 text-gray-700">Select Language</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="border p-2 rounded"
          >
            <option value="python3">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Code Editor Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Editor</h3>
          <CodeMirror
            value={code}
            height="400px"
            extensions={getLanguageExtension()}
            onChange={(value) => setCode(value)}
            className="rounded-lg border border-gray-300"
          />
        </div>

        {/* Run Code Button Section */}
        <div className="flex justify-end mb-6">
          <button
            onClick={runCode}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            Run Code
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Output</h3>
          <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-800 h-48 overflow-auto">
            {output ? output : "Your code output will appear here."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
