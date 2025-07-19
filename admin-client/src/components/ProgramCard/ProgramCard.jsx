/* eslint-disable react/prop-types */

import { AlertTriangle, Calendar, CheckCircle, Clock, Trash, X } from "lucide-react";
import "./programcard.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../../hooks/useToast";
import { addTask, deleteTask } from "../../services/AdminOperations";
import StudentSchedule from "../StudentSchedule/StudentSchedule";

export default function ProgramCard({ program, onClose }) {

    const [isAdding, setIsAdding] = useState(false);
    const [updatedSchedule, setUpdatedSchedule] = useState(program.dailyTasks || []);
    const token = localStorage.getItem("Token");
    const dispatch = useDispatch();
    const [isStudentSchedule, setIsStudentSchedule] = useState(false);


    const [newTask, setNewTask] = useState({
        date: "",
        taskName: "",
        taskDescription: "",
    });
    const [newTaskList, setNewTaskList] = useState([]);

    if (!program) return null;
    const schedule = updatedSchedule;
    const totalTasks = schedule.length;
    const completedTasks = schedule.filter(task => task.completed).length;

    const programProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;


    const startDate = new Date(program.startDate);
    const endDate = new Date(program.endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
        return <div>Invalid date format</div>;
    }

    let dayOfProgram = 0;
    let totalDays = 0;

    if (program.programStatus === "Ongoing") {
        const today = new Date();
        const timeDifference = today - startDate;
        dayOfProgram = Math.floor(timeDifference / (1000 * 3600 * 24)) + 1;
    }

    totalDays = Math.floor((endDate - startDate) / (1000 * 3600 * 24)) + 1;


    useEffect(() => {
        if (program && program.dailyTasks) {
            setUpdatedSchedule(program.dailyTasks);
        }
    }, [program]);


    const handleAddTask = () => {
        setIsAdding(true);
    };

    const handleRemoveTaskFromList = (taskIndex) => {
        setNewTaskList((prevList) => {
            const updatedList = prevList.filter((task, index) => index !== taskIndex);
            return updatedList;
        });
    };

    const handleFinalSaveNewTasks = async () => {
        if (!newTask) {
            alert("No task added!")
        }
        console.log("Saving tasks:", newTaskList);
        const response = await addTask(token, program._id, newTaskList, dispatch)
        if (response.success) {
            showToast("Tasks saved successfully", "success");
            setNewTask({
                date: "",
                taskName: "",
                taskDescription: "",
            })
            setNewTaskList([])
        }
        else {

            showToast("Error saving tasks", "error");
        }

    };

    const sortedSchedule = [...schedule].sort((a, b) => new Date(a.date) - new Date(b.date));


    const handleSaveAddTask = () => {
        if (newTask.date && newTask.taskName && newTask.taskDescription) {
            setNewTaskList((prevList) => {
                const updatedList = [...prevList, { ...newTask }];

                console.log("Updated Task List:", updatedList);
                return updatedList;
            });

            setNewTask({ date: "", taskName: "", taskDescription: "" });
        } else {
            alert("Please fill in all fields.");
        }
    };


    const handleRemoveTask = async (taskId) => {
        const response = await deleteTask(token, program._id, taskId, dispatch);
        if (response.success) {

            showToast("Task removed successfully", "success");
        } else {
            showToast("Failed to remove task", "error");
        }
    };

    return (
        <>
            <div className="overlay-2"></div>
            <div className="program-modal">
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem"
                }} >
                    <div className="program-modal-top-toggle-btns">
                        <button
                            className={`program-schedule-toggle-btn ${!isStudentSchedule ? "active" : ""}`}
                            onClick={() => setIsStudentSchedule(false)}
                        >
                            Trainer Schedule
                        </button>
                        <button
                            className={`program-schedule-toggle-btn ${isStudentSchedule ? "active" : ""}`}
                            onClick={() => {
                                setIsStudentSchedule(true);
                                setIsAdding(false);
                            }}
                        >
                            Student Schedule
                        </button>
                    </div>
                    <X
                        style={{ cursor: "pointer" }}
                        size={"1.7rem"}
                        onClick={onClose}
                    />
                </div>
                <div className="program-modal-content">
                    <div className="program-modal-content-top">
                        <div className="program-modal-header">
                            <div>
                                <div className="program-card-name">
                                    {program.name} - {program.description}
                                </div>
                            </div>
                            <div style={{
                                fontSize: "1rem",
                                fontWeight: "500"
                            }}>Total Students : {program.students.length}</div>

                        </div>
                        {program.programStatus === "Ongoing" ? (
                            <div className="day-progress-container">
                                <div className="day-progress-container-text">
                                    Day {dayOfProgram} of {totalDays}
                                </div>
                            </div>
                        ) : (
                            <div className="programs-modal-duration-text">
                                Program duration: {totalDays} days • {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                            </div>
                        )}

                        <div className="program-progress-container">
                            <div className="program-progress-bar-title">
                                Program Progress
                            </div>
                            <div className="progress-modal-bar">
                                <div
                                    className="progress"
                                    style={{ width: `${programProgress}%` }}
                                ></div>
                            </div>
                            <div style={{ marginTop: "0.5rem", fontStyle: "italic", fontSize: "0.8rem", fontWeight: "500", color: "#7f5ff4" }}>
                                {programProgress.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                    <div className="program-modal-content-bottom">
                        {
                            !isStudentSchedule ? <div className="schedule-list">
                                <div
                                    className="program-modal-list-title"
                                    style={{
                                        fontSize: "1.2rem",
                                        fontWeight: "600",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Schedule List - {schedule.length} Tasks
                                </div>

                                <div className="schedule-container">
                                    {schedule?.length > 0 ? (
                                        <div className="schedule-container">
                                            {sortedSchedule
                                                .map((session, index) => {
                                                    const sessionDate = new Date(session.date).toISOString().split("T")[0];
                                                    const today = new Date().toISOString().split("T")[0];
                                                    let icon;
                                                    let iconClass = "";

                                                    if (session.completed) {
                                                        icon = <CheckCircle color="#19A44C" size={"1.5rem"} />;
                                                        iconClass = "completed-task";
                                                    } else if (sessionDate === today) {
                                                        icon = <Clock className="animated-clock" color="#2563EB" size={"1.5rem"} />;
                                                        iconClass = "today-task";
                                                    } else if (sessionDate < today) {
                                                        icon = <AlertTriangle color="#f44336" size={"1.5rem"} />;
                                                        iconClass = "past-task";
                                                    } else if (sessionDate > today) {
                                                        icon = <Calendar color="orange" size={"1.5rem"} />;
                                                        iconClass = "future-task";
                                                    }

                                                    return (
                                                        <div key={index} className="schedule-item">
                                                            <div className={`program-card-task-status-icon ${iconClass}`}>
                                                                {icon}
                                                            </div>
                                                            <div className="schedule-details">
                                                                <div className="schedule-task">
                                                                    {session.taskName} -{" "}
                                                                    <span className="schedule-description">
                                                                        {session.description}
                                                                    </span>
                                                                </div>
                                                                <div className="schedule-date">
                                                                    {new Date(session.date).toLocaleDateString()}
                                                                </div>
                                                            </div>

                                                            <div
                                                                className="schedule-item-delete"
                                                                onClick={() => handleRemoveTask(session._id)}
                                                            >
                                                                <Trash color="#BB1C48" size={"1.2rem"} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <div className="no-schedule">
                                            No schedule available for this program.
                                        </div>
                                    )}
                                </div>

                            </div> : <StudentSchedule program={program} />
                        }
                        <div className="program-modal-bottom-right">
                            {isAdding ? (
                                <div className="program-modal-add-task-form">
                                    <div style={{
                                        display: "flex",
                                        fontWeight: "650",

                                        color: "#333"
                                    }}>Add New Task</div>
                                    <form onSubmit={(e) => { e.preventDefault(); handleSaveAddTask(); }}>
                                        <div>
                                            <label>Date:</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={newTask.date}
                                                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label>Task Name:</label>
                                            <input
                                                type="text"
                                                name="taskName"
                                                value={newTask.taskName}
                                                onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label>Task Description:</label>
                                            <textarea
                                                name="taskDescription"
                                                value={newTask.taskDescription}
                                                onChange={(e) => setNewTask({ ...newTask, taskDescription: e.target.value })}
                                                style={{
                                                    fontSize: "1rem"
                                                }}
                                            />
                                        </div>
                                        <button className="program-card-add-new" type="submit">Add Task</button>
                                    </form>

                                    <div className="new-task-list">
                                        {newTaskList.length > 0 ? (
                                            newTaskList.map((task, index) => (
                                                <div className="new-task-item" key={index}>
                                                    <div>{task.date}</div>
                                                    <div>{task.taskName}</div>
                                                    <div>{task.taskDescription}</div>
                                                    <button
                                                        className="trash-button-new-task-list"
                                                        onClick={() => handleRemoveTaskFromList(index)}
                                                    >
                                                        <Trash color="#BB1C48" size={"1.2rem"} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{
                                                fontSize: "0.9rem",
                                                fontStyle: "italic"
                                            }}>No tasks added yet.</div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="program-modal-trainer-details">
                                    <div
                                        style={{
                                            fontSize: "1.2rem",
                                            fontWeight: "600",
                                            color: "#333",
                                        }}
                                    >
                                        Trainer Details
                                    </div>
                                    {program.trainerAssigned ? (
                                        <div className="trainer-details">
                                            <div className="trainer-detail-item">
                                                <span className="detail-label">ID:</span>{" "}
                                                {program.trainerAssigned.trainerId}
                                            </div>
                                            <div className="trainer-detail-item">
                                                <span className="detail-label">Name:</span>{" "}
                                                {program.trainerAssigned.name}
                                            </div>
                                            <div className="trainer-detail-item">
                                                <span className="detail-label">Email:</span>{" "}
                                                {program.trainerAssigned.email}
                                            </div>
                                            <div className="trainer-detail-item">
                                                <span className="detail-label">Age:</span>{" "}
                                                {program.trainerAssigned.age}
                                            </div>
                                            <div className="trainer-detail-item">
                                                <span className="detail-label">Gender:</span>{" "}
                                                {program.trainerAssigned.gender}
                                            </div>
                                            <div className="trainer-detail-item">
                                                <span className="detail-label">Address:</span>{" "}
                                                {program.trainerAssigned.address}
                                            </div>
                                            <div className="trainer-detail-item">
                                                <span className="detail-label">Phone:</span>{" "}
                                                {program.trainerAssigned.phone}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="no-trainer-assigned">
                                            No trainer assigned
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="program-modal-action-buttons">
                                {isAdding ? (
                                    <>
                                        <button
                                            className="program-modal-action-button"
                                            onClick={() => {
                                                setIsAdding(false);
                                                setNewTask({
                                                    date: "",
                                                    taskName: "",
                                                    taskDescription: ""
                                                });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="program-modal-action-button"
                                            onClick={handleFinalSaveNewTasks}
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    !isStudentSchedule && <button
                                        className="program-modal-action-button"
                                        onClick={handleAddTask}
                                    >
                                        Add Task
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
