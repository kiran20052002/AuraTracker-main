import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubjectCard from './SubjectCard';
import TimetableDaySelector from './TimetableDaySelector';
import AddSubjectForm from './AddSubjectForm';
import { BASE_URL } from '../../utils/url';

const TimetableView = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetableData, setTimetableData] = useState({ day: 'Monday', schedule: [] });
    const token = localStorage.getItem('token'); 
  const fetchTimetable = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/timetable/${selectedDay}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTimetableData(data);
    } catch (err) {
      console.error('Failed to load timetable:', err);
      setTimetableData({ day: selectedDay, schedule: [] });
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [selectedDay]);

  const handleSubjectAdded = () => {
    fetchTimetable();
  };

  return (
    <div className="p-4">
      <TimetableDaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <AddSubjectForm selectedDay={selectedDay} onSubjectAdded={handleSubjectAdded} />
      <div className="grid gap-3 mt-4">
        {timetableData.schedule.map((subject) => (
          <SubjectCard key={subject._id} subject={subject} selectedDay={selectedDay} onDelete={fetchTimetable} />
        ))}
      </div>
    </div>
  );
};

export default TimetableView;