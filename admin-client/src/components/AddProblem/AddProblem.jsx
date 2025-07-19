import React, { useState, useEffect } from "react";
import "./AddProblem.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProblems,
  handleAddCategory,
  handleAddProblem,
} from "../../services/AdminOperations";
import { showToast } from "../../hooks/useToast";
import { X } from "lucide-react";

export default function AddProblem({ onClose }) {
  const [problemType, setProblemType] = useState("predefined");
  const [platform, setPlatform] = useState("");
  const [link, setLink] = useState("");
  const [qName, setQName] = useState("");
  const [qdescription, setqdescription] = useState("");
  const [manualTestCases, setManualTestCases] = useState([
    { input: "", output: "", isHidden: false },
  ]);
  const [difficulty, setDifficulty] = useState("easy");
  const [constraints, setConstraints] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem("Token");

  const problems = useSelector((state) => state.admin.problems);

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...manualTestCases];
    updatedTestCases[index][field] = value;
    setManualTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setManualTestCases([
      ...manualTestCases,
      { input: "", output: "", isHidden: false },
    ]);
  };

  const removeTestCase = (index) => {
    const updatedTestCases = manualTestCases.filter((_, i) => i !== index);
    setManualTestCases(updatedTestCases);
  };

  const handleCreateCategory = async () => {
    const response = await handleAddCategory(newCategoryName, token, dispatch);
    if (response?.success) {
      showToast("Category Created Successfully!", "success");
      setShowCategoryPopup(false);
      setNewCategoryName("");
    } else {
      showToast(response.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type: problemType,
      problemName: qName,
      platform,
      link,
      description: qdescription,
      constraints,
      sampleInput,
      sampleOutput,
      manualTestCases,
      difficulty,
      categoryId: selectedCategory,
    };

    console.log("payload", payload);

    const reponse = await handleAddProblem(token, payload, dispatch);

    if (reponse?.success) {
      showToast("New Task Added Successfully!", "success");
      setQName("");
      setqdescription("");
      setDifficulty("easy");
      setManualTestCases([{ input: "", output: "", isHidden: false }]);
      setProblemType("manual");
      setPlatform("");
      setLink("");
      setConstraints("");
      setSampleInput("");
      setSampleOutput("");
      setSelectedCategory("");
      onClose();
    } else {
      showToast("Error Adding Task", "error");
    }
  };

  return (
    <div className="overlay">
      <div className="add-manual-task">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="add-manual-task__title">Add Problem</div>
          <X
            className="add-manual-task__close"
            style={{
              cursor: "pointer",
            }}
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit} className="add-manual-task__form">
          <div className="add-manual-task__field">
            <label className="add-manual-task__label">Problem Type</label>
            <select
              className="add-manual-task__select"
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              required
            >
              <option value="manual">Manual</option>
              <option value="predefined">Predefined</option>
            </select>
          </div>

          {problemType === "manual" && (
            <>
              <div className="add-manual-task__field">
                <label className="add-manual-task__label">Question Name</label>
                <input
                  className="add-manual-task__input"
                  type="text"
                  value={qName}
                  onChange={(e) => setQName(e.target.value)}
                  placeholder="e.g., Two Sum Problem"
                  required
                />
              </div>

              <div className="add-manual-task__field">
                <label className="add-manual-task__label">
                  Question Description
                </label>
                <textarea
                  className="add-manual-task__textarea"
                  value={qdescription}
                  onChange={(e) => setqdescription(e.target.value)}
                  placeholder="Enter question description"
                  rows={4}
                  required
                />
              </div>

              <div className="add-manual-task__field">
                <label className="add-manual-task__label">
                  Select Category
                </label>
                <select
                  className="add-manual-task__select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {problems.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="add-manual-task__field">
                <button
                  type="button"
                  onClick={() => setShowCategoryPopup(true)}
                  className="add-manual-task__add-btn"
                  style={{
                    marginTop: "0",
                  }}
                >
                  + Create New Category
                </button>
              </div>

              <div className="add-manual-task__field">
                <label className="add-manual-task__label">Constraints</label>
                <textarea
                  className="add-manual-task__textarea"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="Enter constraints"
                  rows={2}
                />
              </div>

              <div className="add-manual-task__field">
                <label className="add-manual-task__label">Sample Input</label>
                <textarea
                  className="add-manual-task__textarea"
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  placeholder="Enter sample input"
                  rows={2}
                />
              </div>

              <div className="add-manual-task__field">
                <label className="add-manual-task__label">Sample Output</label>
                <textarea
                  className="add-manual-task__textarea"
                  value={sampleOutput}
                  onChange={(e) => setSampleOutput(e.target.value)}
                  placeholder="Enter sample output"
                  rows={2}
                />
              </div>

              <div className="add-manual-task__field">
                <label className="add-manual-task__label">Test Cases</label>
                {manualTestCases.map((tc, index) => (
                  <div key={index} className="add-manual-task__test-case">
                    <div className="add-manual-task__subfield">
                      <label className="add-manual-task__label">Input</label>
                      <textarea
                        className="add-manual-task__textarea"
                        value={tc.input}
                        onChange={(e) =>
                          handleTestCaseChange(index, "input", e.target.value)
                        }
                        placeholder="Enter multi-line input"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="add-manual-task__subfield">
                      <label className="add-manual-task__label">
                        Expected Output
                      </label>
                      <textarea
                        className="add-manual-task__textarea"
                        value={tc.output}
                        onChange={(e) =>
                          handleTestCaseChange(index, "output", e.target.value)
                        }
                        placeholder="Enter expected output"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="add-manual-task__subfield">
                      <label className="add-manual-task__label">
                        Is Hidden?
                      </label>
                      <select
                        className="add-manual-task__select"
                        value={tc.isHidden ? "true" : "false"}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "isHidden",
                            e.target.value === "true"
                          )
                        }
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>

                    {manualTestCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="add-manual-task__remove-btn"
                      >
                        Remove
                      </button>
                    )}
                    <hr className="add-manual-task__divider" />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTestCase}
                  className="add-manual-task__add-btn"
                >
                  + Add Test Case
                </button>
              </div>
            </>
          )}

          {problemType === "predefined" && (
            <>
              <div className="add-manual-task__field">
                <label className="add-manual-task__label">Problem Name</label>
                <input
                  className="add-manual-task__input"
                  type="text"
                  value={qName}
                  onChange={(e) => setQName(e.target.value)}
                  placeholder="e.g., Two Sum"
                  required
                />
              </div>

              <div className="add-manual-task__field">
                <label className="add-manual-task__label">
                  Problem Description
                </label>
                <textarea
                  className="add-manual-task__textarea"
                  value={qdescription}
                  onChange={(e) => setqdescription(e.target.value)}
                  placeholder="Short description of the problem"
                  rows={3}
                  required
                />
              </div>

              <div className="add-manual-task__field">
                <label className="add-manual-task__label">
                  Select Category
                </label>
                <select
                  className="add-manual-task__select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {problems.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="add-manual-task__field">
                <button
                  type="button"
                  onClick={() => setShowCategoryPopup(true)}
                  className="add-manual-task__add-btn"
                  style={{
                    marginTop: "0",
                  }}
                >
                  + Create New Category
                </button>
              </div>

              <div className="add-manual-task__field">
                <label className="add-manual-task__label">Platform</label>
                <input
                  className="add-manual-task__input"
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g., LeetCode"
                />
              </div>
              <div className="add-manual-task__field">
                <label className="add-manual-task__label">Problem Link</label>
                <input
                  className="add-manual-task__input"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://leetcode.com/problems/two-sum/"
                />
              </div>
            </>
          )}

          <div className="add-manual-task__field">
            <label className="add-manual-task__label">Difficulty</label>
            <select
              className="add-manual-task__select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button type="submit" className="add-manual-task__submit-btn">
            Submit Task
          </button>
        </form>
      </div>

      {showCategoryPopup && (
        <div className="category-popup-overlay">
          <div className="category-popup-content">
            <h3>Create New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="add-manual-task__input"
              placeholder="Enter category name"
            />
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <button
                onClick={handleCreateCategory}
                className="add-manual-task__submit-btn"
              >
                Create
              </button>
              <button
                onClick={() => setShowCategoryPopup(false)}
                className="add-manual-task__remove-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
