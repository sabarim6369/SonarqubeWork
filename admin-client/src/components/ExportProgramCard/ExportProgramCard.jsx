import { useSelector } from "react-redux";
import "./ExportProgramCard.css";
import { X } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";
import ProgramCard from "../ProgramCard/ProgramCard";

export default function ExportProgramCard({ onClose }) {
  const programs = useSelector((state) => state.admin.programs);
  const [searchQueries, setSearchQueries] = useState({
    programName: "",
    collegeName: "",
    startDate: "",
    endDate: "",
  });
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [viewMore, setViewMore] = useState(null);

  console.log(programs);

  const handleSearchChange = (e) => {
    setSearchQueries({ ...searchQueries, [e.target.name]: e.target.value });
  };

  const sortedPrograms = [...programs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredPrograms = sortedPrograms.filter((program) => {
      const { programName, collegeName, startDate, endDate } = searchQueries;
      return (
        program.name.toLowerCase().includes(programName.toLowerCase()) &&
        program.college.name.toLowerCase().includes(collegeName.toLowerCase()) &&
        (!startDate || new Date(program.startDate) >= new Date(startDate)) &&
        (!endDate || new Date(program.endDate) <= new Date(endDate))
      );
  });
  

  const toggleSelection = (programId) => {
    setSelectedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  

  const exportToCSV = (data, filename) => {
    const formattedData = data.map((program) => ({
      programId: program.programId,
      name: program.name,
      description: program.description,
      startDate: new Date(program.startDate).toLocaleDateString(),
      endDate: new Date(program.endDate).toLocaleDateString(),
      batch: program.batch,
      students: program.students?.length || 0,
      college: program.college?.name || "N/A",
      code: program.code,
      location: program.location,
      trainerAssigned: program.trainerAssigned?.name || "N/A",
      programStatus: program.programStatus,
      dailyTasks: program.dailyTasks?.length || 0,
      studentTasks: program.studentTasks?.length || 0,
    }));

    const csv = Papa.unparse(formattedData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportAll = () => {
    exportToCSV(programs, "all_programs.csv");
  };

  const handleExportSelected = () => {
    const selectedData = programs.filter((p) =>
      selectedPrograms.includes(p._id)
    );
    exportToCSV(selectedData, "selected_programs.csv");
  };

  return (
    <div className="overlay">
      <div className="export-program-container">
        <div className="export-program-header">
          <div className="export-program-title">Export Programs</div>
          <X style={{ cursor: "pointer" }} size={"1.5rem"} onClick={onClose} />
        </div>

        <div className="export-program-options">
          <div className="export-program-actions">
            <button className="export-program-button" onClick={handleExportAll}>
              Export All
            </button>
            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.7rem" }}
            >
              <button
                className="export-program-button"
                onClick={() => {
                  setSearchQueries({
                    programName: "",
                    collegeName: "",
                    startDate: "",
                    endDate: "",
                  });
                  setSelectedPrograms([]);
                }}
              >
                Clear All
              </button>
              <button
                className="export-program-button"
                onClick={handleExportSelected}
                disabled={selectedPrograms.length === 0}
              >
                Export Selected
              </button>
            </div>
          </div>

          <div className="export-program-search">
            <input
              type="text"
              placeholder="Search by Program Name"
              name="programName"
              value={searchQueries.programName}
              onChange={handleSearchChange}
            />
            <input
              type="text"
              placeholder="Search by College Name"
              name="collegeName"
              value={searchQueries.collegeName}
              onChange={handleSearchChange}
            />
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = e.target.value ? "date" : "text")}
              placeholder="Search by Start Date"
              name="startDate"
              value={searchQueries.startDate}
              onChange={handleSearchChange}
            />
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = e.target.value ? "date" : "text")}
              placeholder="Search by End Date"
              name="endDate"
              value={searchQueries.endDate}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="export-program-list">
          {filteredPrograms.map((program) => (
            <div key={program._id} className="export-program-item">
              <input
                type="checkbox"
                checked={selectedPrograms.includes(program._id)}
                onChange={() => toggleSelection(program._id)}
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  marginRight: "0.5rem",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: selectedPrograms.includes(program._id)
                    ? "#fff"
                    : "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  outline: "none",
                  transition: "background-color 0.3s ease",
                  WebkitAppearance: "none",
                  WebkitTapHighlightColor: "transparent",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                }}
              />
              <div className="export-program-details">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0.5rem",
                    alignContent: "center",
                  }}
                >
                  <div className="export-program-item-name">{program.name}</div>{" "}
                  -
                  <div className="export-program-item-description">
                    {program.description}
                  </div>
                </div>
                <div className="export-program-item-college">
                  <span style={{ fontWeight: 500 }}>College:</span>{" "}
                  {program.college.name}
                </div>
                <div className="export-program-item-college">
                  <span style={{ fontWeight: 500 }}>Batch:</span>{" "}
                  {program.batch}
                </div>
                <div className="export-program-item-college">
                  <span style={{ fontWeight: 500 }}>Start Date:</span>{" "}
                  {new Date(program.startDate).toLocaleDateString()}
                </div>
                <div className="export-program-item-college">
                  <span style={{ fontWeight: 500 }}>End Date:</span>{" "}
                  {new Date(program.endDate).toLocaleDateString()}
                </div>

                <div className="export-program-item-status">
                  <span
                    className={`status ${program.programStatus?.toLowerCase()}`}
                  >
                    {program.programStatus}
                  </span>
                </div>
                <button
                  className="view-more-button"
                  onClick={() => setViewMore(program)}
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {viewMore && (
        <ProgramCard program={viewMore} onClose={() => setViewMore(null)} />
      )}
    </div>
  );
}
