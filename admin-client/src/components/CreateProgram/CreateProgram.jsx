import { useState, useEffect } from "react";
import "./createprogram.css";
import { X } from "lucide-react";
import {
  addProgram,
  getAllColleges,
  getAllPrograms,
  getAllTrainers,
} from "../../services/AdminOperations";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { showToast } from "../../hooks/useToast";
import { setTrainers } from "../../redux/actions/adminActions";

export default function CreateProgram({ onClose }) {
  const token = localStorage.getItem("Token");
  const trainers = useSelector((state) => state.admin.trainers);
  const dispatch = useDispatch();

  const [programDetails, setProgramDetails] = useState({
    name: "",
    startDate: "",
    endDate: "",
    batch: "",
    college: "",
    programStatus: "Scheduled",
    location: "",
    trainerAssigned: "",
    description: "",
  });

  const [tasks, setTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState({
    date: "",
    taskName: "",
    description: "",
  });

  const [trainersList, setTrainersList] = useState([]);
  const [error, setError] = useState("");

  const colleges = useSelector((state) => state.admin.colleges, shallowEqual);

  const fetchAllColleges = async () => {
    await getAllColleges(token, dispatch);
  };

  useEffect(() => {
    fetchAllColleges();
  }, []);

  useEffect(() => {
    console.log("Trainers:", trainers);

    if (trainers && programDetails.startDate && programDetails.endDate) {
      console.log("Program Details:", programDetails);

      const filteredTrainers = trainers.filter((trainer) => {
        console.log("Checking trainer:", trainer.name);

        if (
          !trainer.programsAssigned ||
          !Array.isArray(trainer.programsAssigned) ||
          trainer.programsAssigned.length === 0
        ) {
          console.log("Trainer has no assigned programs, including them.");
          return true;
        }

        const isConflict = trainer.programsAssigned.some((program) => {
          const programStartDate = new Date(program.startDate);
          const programEndDate = new Date(program.endDate);

          const newProgramStartDate = new Date(programDetails.startDate);
          const newProgramEndDate = new Date(programDetails.endDate);

          const hasConflict =
            (newProgramStartDate >= programStartDate &&
              newProgramStartDate <= programEndDate) ||
            (newProgramEndDate >= programStartDate &&
              newProgramEndDate <= programEndDate) ||
            (newProgramStartDate <= programStartDate &&
              newProgramEndDate >= programEndDate);

          console.log("Conflict Found:", hasConflict);

          return hasConflict;
        });

        console.log("Does this trainer have a date conflict?", isConflict);

        return !isConflict;
      });

      console.log("Filtered Trainers:", filteredTrainers);

      setTrainersList(filteredTrainers);
    }
  }, [trainers, programDetails.startDate, programDetails.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgramDetails({ ...programDetails, [name]: value });
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({ ...taskDetails, [name]: value });
  };

  const handleAddTask = () => {
    const { taskName, description, date, endDate } = taskDetails;
    const programStartDate = new Date(programDetails.startDate);
    const programEndDate = new Date(programDetails.endDate);

    if (!taskName || !description || !date) {
      alert("Please fill in all task details.");
      return;
    }

    const taskStartDate = new Date(date);
    const taskEndDate = endDate ? new Date(endDate) : taskStartDate;

    if (taskStartDate < programStartDate || taskEndDate > programEndDate) {
      alert("Task date must be within the program's start and end dates.");
      return;
    }

    if (taskEndDate < taskStartDate) {
      alert("End date cannot be before start date.");
      return;
    }

    const newTask = {
      date: taskStartDate.toISOString().split("T")[0],
      taskName,
      description,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    setTaskDetails({ date: "", taskName: "", description: "", endDate: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      startDate,
      endDate,
      batch,
      trainerAssigned,
      location,
      description,
    } = programDetails;

    const programStartDate = new Date(startDate);
    const programEndDate = new Date(endDate);

    if (programEndDate < programStartDate) {
      setError("End date cannot be earlier than the start date.");
      return;
    }

    if (
      !name ||
      !startDate ||
      !endDate ||
      !batch ||
      !trainerAssigned ||
      !location ||
      !description
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...programDetails,
      dailyTasks: tasks,
    };

    console.log(payload);

    try {
      const response = await addProgram(token, payload);
      if (response.success) {
        showToast("Program added successfully", "success");
        await getAllPrograms(token, dispatch);
        await getAllTrainers(token, dispatch);
        console.log("Program added successfully:", response);
      } else {
        showToast("Error adding program", "error");
      }
      onClose();
    } catch (error) {
      console.error("Error adding program:", error.message);
      alert("Failed to add program. Please try again.");
    }
  };

  return (
    <div className="create-program-container">
      <div className="create-program-header">
        Add Program Details
        <X
          onClick={onClose}
          className="create-program-close-button"
          size="1.7rem"
          color="#333"
        />
      </div>

      <form className="create-program-form" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Program Name *</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Program Name"
            value={programDetails.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Program Description *</label>
          <textarea
            name="description"
            id="description"
            placeholder="Program Description"
            value={programDetails.description}
            onChange={handleChange}
            required
            style={{
              fontFamily: "Montserrat",
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date *</label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={programDetails.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date *</label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={programDetails.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="college">College *</label>
          <select id="college" name="college" value={programDetails.college} onChange={handleChange} required defaultValue="">
            <option value="" disabled>
              Select a College
            </option>
            {colleges &&
              colleges.length > 0 &&
              colleges.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="batch">Batch *</label>
          <input
            type="number"
            name="batch"
            id="batch"
            placeholder="Batch"
            value={programDetails.batch}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="trainerAssigned">Trainer Assigned *</label>
          <select
            name="trainerAssigned"
            id="trainerAssigned"
            value={programDetails.trainerAssigned}
            onChange={(e) =>
              setProgramDetails({
                ...programDetails,
                trainerAssigned: e.target.value,
              })
            }
            required
          >
            <option value="">Select Trainer</option>
            {trainersList.map((trainer) => (
              <option key={trainer.trainerId} value={trainer.trainerId}>
                {trainer.name} ({trainer.specialization})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Location"
            value={programDetails.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="daily-task-section">
          <h3>Schedule Daily Tasks</h3>
          <h5 style={{ color: "red", fontWeight: "600" }}>
            You can add tasks later if needed.
          </h5>
          <div className="form-group">
            <label htmlFor="date">Task Date</label>
            <input
              type="date"
              name="date"
              value={taskDetails.date}
              onChange={handleTaskChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="taskName">Task Name</label>
            <input
              type="text"
              name="taskName"
              value={taskDetails.taskName}
              onChange={handleTaskChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Task Description</label>
            <input
              type="text"
              name="description"
              value={taskDetails.description}
              onChange={handleTaskChange}
            />
          </div>
          <div
            className="task-buttons"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button type="button" onClick={handleAddTask}>
              Add Task
            </button>
            <button type="button" onClick={() => setTasks([])}>
              Reset Tasks
            </button>
          </div>

          <div className="task-list">
            <h3>Scheduled Tasks:</h3>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div key={index} className="task-item">
                  <p>
                    <strong>{task.date}</strong>
                  </p>
                  <p>
                    {task.taskName} - {task.description}
                  </p>
                </div>
              ))
            ) : (
              <p>No tasks added yet.</p>
            )}
          </div>
        </div>

        <button type="submit">Add Program</button>
      </form>
    </div>
  );
}
