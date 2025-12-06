import React from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TimetableDaySelector = ({ selectedDay, setSelectedDay }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {days.map((day) => (
        <button
          key={day}
          className={`px-4 py-1 rounded-full text-sm border ${
            selectedDay === day ? 'bg-blue-600 text-white' : 'bg-white text-black'
          }`}
          onClick={() => setSelectedDay(day)}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default TimetableDaySelector;