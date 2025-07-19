import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './Calendar.css';

export default function CustomCalendar({ program, onClose }) {
  return (
    <div className="calendar-container">
      <Calendar className="custom-calendar" />
    </div>
  );
}
