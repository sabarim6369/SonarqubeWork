import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./ProgramCalendar.css";

const ProgramCalendar = ({ programs, setSelectedProgram }) => {
  const [date, setDate] = useState(new Date());

  const handleDateClick = (selectedDate) => {
    setDate(selectedDate);
    setSelectedProgram(selectedDate); 
  };


  const getProgramsForDate = (date) => {
    return programs?.filter(
      (program) =>
        new Date(program.startDate) <= date && new Date(program.endDate) >= date
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Ongoing":
        return "#28a745";
      case "Scheduled":
        return "#D98324";
      case "Completed":
        return "#ccc";
      default:
        return "#000000";
    }
  };

  return (
    <div className="dashboard-calendar-container">
      <Calendar
        onChange={handleDateClick}
        value={date}
        tileContent={({ date }) => {
          const programsForDate = getProgramsForDate(date);
          return programsForDate?.length > 0 ? (
            <div
              className="program-calendar-dot"
              style={{
                color: getStatusColor(programsForDate[0]?.programStatus),
              }}
              title={programsForDate?.map((p) => p.name).join(", ")}
            >
              ●
            </div>
          ) : null;
        }}
      />
    </div>
  );
};

export default ProgramCalendar;
