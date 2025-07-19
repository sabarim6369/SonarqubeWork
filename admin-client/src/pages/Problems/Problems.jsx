import { ArrowLeft, Info, Search, X } from "lucide-react";
import "./Problems.css";
import { useEffect, useState } from "react";
import AddProblem from "../../components/AddProblem/AddProblem";
import {
  getAllProblems,
  handleDeleteCategory,
  handleDeleteProblem,
  handleEditProblem,
  handleProgramEdit,
} from "../../services/AdminOperations";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../hooks/useToast";

export default function Problems() {
  const [searchQuery, setSearchQuery] = useState("");
  const categoryWithProblem = useSelector((state) => state.admin.problems);
  const token = localStorage.getItem("Token");
  const [isAddProblemOpen, setIsAddProblemOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const dispatch = useDispatch();

  const fetchAllProblems = async () => {
    await getAllProblems(token, dispatch);
  };

  useEffect(() => {
    fetchAllProblems();
  }, [token]);

  useEffect(() => {
    if (selectedCategory && categoryWithProblem) {
      const updatedCategory = categoryWithProblem.find(
        (category) => category.categoryName === selectedCategory.categoryName
      );
      if (updatedCategory) {
        setSelectedCategory(updatedCategory);
      }
    }
  }, [categoryWithProblem]);

  const filteredProblems = categoryWithProblem?.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteCategory = async () => {
    const isOk = window.confirm(
      "Are you sure you want to delete this category? This action cannot be undone."
    );
    if (!isOk) return;
    try {
      const response = await handleDeleteCategory(
        token,
        selectedCategory._id,
        dispatch
      );
      if (response.success) {
        setSelectedCategory(null);
        showToast("Category deleted successfully", "success");
      } else {
        showToast("Failed to delete category", "error");
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const editProblem = async () => {
    try {
      const response = await handleEditProblem(
        token,
        selectedProblem._id,
        selectedProblem,
        dispatch
      );
      if (response.success) {
        showToast("Problem updated successfully", "success");
      } else {
        showToast("Failed to update problem", "error");
      }
    } catch (error) {
      console.error("Failed to update problem:", error);
    } finally {
      setSelectedProblem(null);
    }
  };

  const deleteProblem = async () => {
    const isOk = window.confirm(
      "Are you sure you want to delete this problem? This action cannot be undone."
    );
    if (!isOk) return;
    try {
      const response = await handleDeleteProblem(
        token,
        selectedProblem._id,
        selectedCategory._id,
        dispatch
      );
      if (response.success) {
        showToast("Problem deleted successfully", "success");
      } else {
        showToast("Failed to delete problem", "error");
      }
    } catch (error) {
      console.error("Failed to delete problem:", error);
    } finally {
      setSelectedProblem(null);
    }
  };

  return (
    <div className="problems-container">
      <div className="problems-header">
        <div className="problems-header-text">
          <div className="vertical-bar-title"></div>
          <div className="problems-title">Problems</div>
        </div>
        <div className="problems-header-left">
          <div className="problems-searchbar-container">
            <Search size="1.7rem" color="#9CA3AF" />
            <input
              className="problems-search-bar"
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            onClick={() => {
              setIsAddProblemOpen(true);
            }}
            className="problems-add-button"
          >
            Add Problem
          </div>
          <div className="problems-add-button">Export Data</div>
        </div>
      </div>

      <div className="problems-content">
        {selectedCategory ? (
          <div className="problem-view">
            <div className="problem-view-header">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ArrowLeft
                  style={{
                    cursor: "pointer",
                    marginRight: "0.5rem",
                  }}
                  onClick={() => {
                    setSelectedCategory(null);
                  }}
                  size={"1.5rem"}
                  color="#333"
                />
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {selectedCategory.categoryName}
                </div>
              </div>
              <div
                onClick={() => deleteCategory()}
                className="category-delete-button"
              >
                Delete Category
              </div>
            </div>
            <div className="problem-list">
              {(() => {
                const filteredCategoryProblems =
                  selectedCategory.problems.filter((problem) =>
                    problem.problemName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  );
                return filteredCategoryProblems.length > 0 ? (
                  filteredCategoryProblems.map((problem, index) => (
                    <div key={index} className="problem-item">
                      <Info
                        style={{
                          position: "absolute",
                          right: "1rem",
                          top: "1rem",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedProblem(problem)}
                        color="#6366f1"
                      />
                      <div className="problem-name">
                        {index + 1}. {problem.problemName}
                      </div>
                      <div className="problem-meta">
                        {problem.platform ? (
                          <span className="problem-platform">
                            Platform: {problem.platform}
                          </span>
                        ) : (
                          <span className="problem-platform">
                            Platform:{" "}
                            {problem.type === "manual" ? "Manual" : "Unknown"}
                          </span>
                        )}
                      </div>
                      <div className="problem-description">
                        {problem.description}
                      </div>
                      <span
                        className={`problem-difficulty ${
                          problem.difficulty === "easy"
                            ? "easy"
                            : problem.difficulty === "medium"
                            ? "medium"
                            : "hard"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: "400",
                      fontStyle: "italic",
                      color: "#ccc",
                      textAlign: "center",
                      marginTop: "2rem",
                    }}
                  >
                    No Problems Found
                  </div>
                );
              })()}
            </div>
          </div>
        ) : filteredProblems?.length > 0 ? (
          filteredProblems?.map((category, index) => (
            <div key={index} className="category-item">
              <div>
                <div className="category-name">{category.categoryName}</div>
                <div className="category-problem-length">
                  {category.problems.length}
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedCategory(category);
                }}
                className="category-item-button"
              >
                View Problems
              </div>
            </div>
          ))
        ) : (
          <p>No problems found.</p>
        )}
      </div>

      {isAddProblemOpen && (
        <AddProblem onClose={() => setIsAddProblemOpen(false)} />
      )}
      {selectedProblem && selectedProblem.type === "manual" && (
        <div className="problem-popup-overlay">
          <div className="problem-popup">
            <div className="problem-view-header">
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Edit Manual Problem
              </div>
              <X
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setSelectedProblem(null)}
              />
            </div>

            <div className="problem-edit-form">
              <label>Problem Name</label>
              <input
                type="text"
                className="problem-edit-input"
                value={selectedProblem.problemName}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    problemName: e.target.value,
                  })
                }
              />

              <label>Description</label>
              <textarea
                className="problem-edit-textarea"
                rows={4}
                value={selectedProblem.description}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    description: e.target.value,
                  })
                }
              />

              <label>Difficulty</label>
              <select
                className="problem-edit-input"
                value={selectedProblem.difficulty}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    difficulty: e.target.value,
                  })
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <label>Constraints</label>
              <textarea
                className="problem-edit-textarea"
                rows={2}
                value={selectedProblem.constraints}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    constraints: e.target.value,
                  })
                }
              />

              <label>Sample Input</label>
              <textarea
                className="problem-edit-textarea"
                rows={2}
                value={selectedProblem.sampleInput}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    sampleInput: e.target.value,
                  })
                }
              />

              <label>Sample Output</label>
              <textarea
                className="problem-edit-textarea"
                rows={2}
                value={selectedProblem.sampleOutput}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    sampleOutput: e.target.value,
                  })
                }
              />

              <label>Manual Test Cases</label>
              {selectedProblem.manualTestCases?.map((testCase, idx) => (
                <div key={idx} className="manual-test-case-block">
                  <label>Input</label>
                  <textarea
                    className="problem-edit-textarea"
                    rows={2}
                    value={testCase.input}
                    onChange={(e) => {
                      const updated = [...selectedProblem.manualTestCases];
                      updated[idx].input = e.target.value;
                      setSelectedProblem({
                        ...selectedProblem,
                        manualTestCases: updated,
                      });
                    }}
                  />
                  <label>Output</label>
                  <textarea
                    className="problem-edit-textarea"
                    rows={2}
                    value={testCase.output}
                    onChange={(e) => {
                      const updated = [...selectedProblem.manualTestCases];
                      updated[idx].output = e.target.value;
                      setSelectedProblem({
                        ...selectedProblem,
                        manualTestCases: updated,
                      });
                    }}
                  />
                </div>
              ))}

              <div className="problem-actions">
                <button onClick={editProblem} className="problem-edit-button">
                  Save
                </button>
                <button
                  onClick={handleDeleteProblem}
                  className="problem-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedProblem && selectedProblem.type === "predefined" && (
        <div className="problem-popup-overlay">
          <div className="problem-popup">
            <div className="problem-view-header">
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Edit Predefined Problem
              </div>
              <X
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setSelectedProblem(null)}
              />
            </div>

            <div className="problem-edit-form">
              <label>Problem Name</label>
              <input
                type="text"
                className="problem-edit-input"
                value={selectedProblem.problemName}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    problemName: e.target.value,
                  })
                }
              />

              <label>Description</label>
              <textarea
                className="problem-edit-textarea"
                rows={4}
                value={selectedProblem.description}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    description: e.target.value,
                  })
                }
              />

              <label>Difficulty</label>
              <select
                className="problem-edit-input"
                value={selectedProblem.difficulty}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    difficulty: e.target.value,
                  })
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <label>Platform</label>
              <input
                type="text"
                className="problem-edit-input"
                value={selectedProblem.platform}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    platform: e.target.value,
                  })
                }
              />

              <label>Link</label>
              <input
                type="url"
                className="problem-edit-input"
                value={selectedProblem.link}
                onChange={(e) =>
                  setSelectedProblem({
                    ...selectedProblem,
                    link: e.target.value,
                  })
                }
              />

              <div className="problem-actions">
                <button
                  onClick={handleEditProblem}
                  className="problem-edit-button"
                >
                  Save
                </button>
                <button
                  onClick={deleteProblem}
                  className="problem-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
