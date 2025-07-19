import { useEffect, useState } from "react";
import "./StudentSchedule.css";
import { Calendar, CheckCircle, Clock } from "lucide-react";

export default function StudentSchedule({ program }) {
  const [studentsTasks, setStudentsTasks] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  console.log(program);

  useEffect(() => {
    if (program) {
      const startDate = new Date(program.startDate);
      const endDate = new Date(program.endDate);
      const dates = [];

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        dates.push(new Date(d).toISOString().split("T")[0]);
      }

      setAvailableDates(dates);

      const allTasks = [];

      (program.studentTasks || []).forEach((task) => {
        if (task.date) {
          allTasks.push({
            type: "auto",
            date: new Date(task.createdAt).toISOString().split("T")[0],
            taskName: task.taskName,
            description: task.description,
            platform: task.platform,
            link: task.link,
            studentsCompleted: task.studentsCompleted || [],
            dueDate: task.date,
          });
        }
      });

      (program.studentsManualTasks || []).forEach((task) => {
        if (task.createdAt) {
          allTasks.push({
            type: "manual",
            date: new Date(task.createdAt).toISOString().split("T")[0],
            taskName: task.qName,
            description: task.qdescription,
            platform: "Manual",
            studentsCompleted: [],
            dueDate: task.Duedate,
          });
        }
      });

      const sortedTasks = allTasks.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      console.log(sortedTasks);

      setStudentsTasks(sortedTasks);

      const today = new Date().toISOString().split("T")[0];
      if (dates.includes(today)) {
        setSelectedDate(today);
      } else {
        setSelectedDate(dates[0]);
      }
    }
  }, [program]);

  const getStatusIcon = (task) => {
    const taskDate = new Date(task.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (taskDate < today && task.studentsCompleted?.length > 0) {
      return (
        <CheckCircle className="task-status completed" title="Completed" />
      );
    }
    if (taskDate.toDateString() === today.toDateString()) {
      return <Clock className="task-status ongoing" title="Ongoing" />;
    }
    return <Calendar className="task-status scheduled" title="Scheduled" />;
  };

  const tasksForSelectedDate = studentsTasks.filter(
    (task) => task.date.split("T")[0] === selectedDate
  );

  return (
    <div className="student-schedule-container">
      <div className="student-schedule-title">Student Schedule</div>

      <div className="date-list">
        {availableDates.map((date) => (
          <button
            key={date}
            className={`date-item ${selectedDate === date ? "selected" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            {new Date(date).toLocaleDateString()}
          </button>
        ))}
      </div>

      {selectedDate ? (
        tasksForSelectedDate.length > 0 ? (
          <div className="student-schedule-list">
            {tasksForSelectedDate.map((task, index) => (
              <div key={index} className="student-schedule-item">
                <div className="task-header">
                  <span className="task-name">
                    <span className="task-label">Task Name:</span>{" "}
                    {task.taskName || "No task name"}
                  </span>
                  {getStatusIcon(task)}
                </div>
                <span className="task-description">
                  <span className="task-label">Description:</span>{" "}
                  {task.description || "No description available"}
                </span>
                {task.link && (
                  <span className="task-link">
                    <span className="task-label">Link:</span>
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {task.link}
                    </a>
                  </span>
                )}
                <span className="task-completed">
                  <span className="task-label">Students Completed:</span>{" "}
                  {Array.isArray(task.studentsCompleted)
                    ? task.studentsCompleted.length
                    : 0}
                </span>
                <span>
                  <span className="task-label">Due Date:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="no-tasks-message">
            No tasks available for this date.
          </span>
        )
      ) : (
        <span className="no-tasks-message">Select a date to see tasks.</span>
      )}
    </div>
  );
}
