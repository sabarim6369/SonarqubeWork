import {
  Calendar,
  CheckCircle,
  GraduationCap,
  Info,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./programs.css";
import CreateProgram from "../../components/CreateProgram/CreateProgram";
import { useDispatch, useSelector } from "react-redux";
import { getAllPrograms, getAllTrainers } from "../../services/AdminOperations";
import ProgramCard from "../../components/ProgramCard/ProgramCard";
import ManageProgramCard from "../../components/ManageProgramCard/ManageProgramCard";
import ExportProgramCard from "../../components/ExportProgramCard/ExportProgramCard";

export default function Programs() {
  const [loading, setLoading] = useState(true);
  const [isCreateProgram, setIsCreateProgram] = useState(false);
  const [isOpenCard, setIsOpenCard] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [actionType, setActionType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageProgram, setManageProgram] = useState(false);
  const [isExport, setIsExport] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem("Token");

  const programs = useSelector((state) => state.admin.programs) || [];

  useEffect(() => {
    async function fetchPrograms() {
      await getAllPrograms(token, dispatch);
      await getAllTrainers(token, dispatch);
    }
    fetchPrograms();
    setLoading(false);
  }, [token, dispatch]);

  useEffect(() => {
    if (programs && programs.length > 0 && selectedProgram) {
      const programExists = programs.find(
        (program) => program.programId === selectedProgram.programId
      );
      if (!programExists) {
        setSelectedProgram(null);
      } else {
        setSelectedProgram(programExists);
      }
    }
  }, [programs, selectedProgram]);

  const calculateProgress = (dailyTasks) => {
    if (!dailyTasks || !Array.isArray(dailyTasks) || dailyTasks.length === 0) {
      return { completed: 0, total: 0 };
    }

    let completedTasks = 0;
    let totalTasks = dailyTasks.length;

    dailyTasks.forEach((task) => {
      if (task.completed) {
        completedTasks++;
      }
    });

    return { completed: completedTasks, total: totalTasks };
  };

  const handleCreateProgramOpen = () => {
    setIsCreateProgram(true);
  };

  const handleExportData = () => {
    setIsExport(true);
  };

  const handleCreateProgramClose = () => {
    setIsCreateProgram(false);
  };

  const handleCardOpen = (program, type) => {
    setSelectedProgram(program);
    if (type == "Manage") {
      setManageProgram(true);
    } else if (type == "View") {
      setIsOpenCard(true);
    }
  };

  const handleCardClose = () => {
    setIsOpenCard(false);
    setSelectedProgram(null);
    setActionType("");
  };

  const sortPrograms = (programs) => {
    const ongoing = programs.filter(
      (program) => program.programStatus === "Ongoing"
    );
    const scheduled = programs.filter(
      (program) => program.programStatus === "Scheduled"
    );
    const completed = programs.filter(
      (program) => program.programStatus === "Completed"
    );

    return [...ongoing, ...scheduled, ...completed];
  };

  const sortedPrograms = sortPrograms(programs);

  const filteredPrograms = sortedPrograms.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.trainerAssigned?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      program.startDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.endDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="programs-container">
      <div className="programs-header">
        <div className="programs-header-text">
          <div className="vertical-bar-title"></div>
          <div className="programs-title">Training Programs</div>
        </div>
        <div className="programs-header-left">
          <div className="programs-searchbar-container">
            <Search size="1.7rem" color="#9CA3AF" />
            <input
              className="programs-search-bar"
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            className="programs-add-button"
            onClick={handleCreateProgramOpen}
          >
            Create Program
          </div>
          <div className="programs-add-button" onClick={handleExportData}>
            Export Data
          </div>
        </div>
      </div>

      {isCreateProgram && (
        <div className="overlay" onClick={handleCreateProgramClose}></div>
      )}
      {isManageProgram && (
        <div className="overlay" onClick={handleCreateProgramClose}></div>
      )}

      <div className="programs-content">
        {filteredPrograms && filteredPrograms.length !== 0 ? (
          filteredPrograms.map((program, index) => {
            const { completed, total } = calculateProgress(program.dailyTasks);

            return (
              <div className="program-card" key={index}>
                <div className="program-card-header">
                  <div className="program-title">{program.name}</div>
                  <span
                    className={`program-status ${program.programStatus.toLowerCase()}`}
                  >
                    {program.programStatus}
                  </span>
                </div>

                <div className="program-details">
                  <p>
                    <GraduationCap
                      size="1.2rem"
                      color="#7A808D"
                      style={{ marginRight: "0.5rem" }}
                    />
                    {program.college.name}
                  </p>

                  <p>
                    <Calendar
                      size="1.2rem"
                      color="#7A808D"
                      style={{ marginRight: "0.5rem" }}
                    />
                    {new Date(program.startDate).toLocaleDateString()} -{" "}
                    {new Date(program.endDate).toLocaleDateString()}
                  </p>
                  {/* <p>
                    <Users
                      size="1.2rem"
                      color="#7A808D"
                      style={{ marginRight: "0.5rem" }}
                    />
                    Trainer Assigned : {program.trainerAssigned.name}
                  </p> */}
                  <p>
                    <Users
                      size="1.2rem"
                      color="#7A808D"
                      style={{ marginRight: "0.5rem" }}
                    />
                    Batch : {program.batch}
                  </p>
                  <p>
                    <Info
                      size="1.2rem"
                      color="#7A808D"
                      style={{ marginRight: "0.5rem" }}
                    />
                    Code : {program.code}
                  </p>
                </div>

                <div className="program-progress">
                  <div className="progress-text">
                    <CheckCircle
                      size="1.2rem"
                      color="#6B7280"
                      style={{ marginRight: "0.5rem" }}
                    />
                    Progress ({completed}/{total})
                  </div>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${
                          total === 0 || isNaN(completed) || isNaN(total)
                            ? 0
                            : (completed / total) * 100
                        }%`,
                        transition: "width 0.5s ease",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="program-actions">
                  <button
                    className="view-schedule-btn"
                    onClick={() => handleCardOpen(program, "View")}
                  >
                    View Schedule
                  </button>
                  <button
                    className="manage-btn"
                    onClick={() => handleCardOpen(program, "Manage")}
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-items-found-text">No programs available</div>
        )}
      </div>

      {isCreateProgram && <CreateProgram onClose={handleCreateProgramClose} />}
      {isOpenCard && (
        <ProgramCard
          program={selectedProgram}
          actionType={actionType}
          onClose={handleCardClose}
        />
      )}
      {isManageProgram && (
        <ManageProgramCard
          program={selectedProgram}
          onClose={() => {
            setManageProgram(false);
          }}
        />
      )}
      {isExport && (
        <ExportProgramCard
          onClose={() => {
            setIsExport(false);
          }}
        />
      )}
    </div>
  );
}
