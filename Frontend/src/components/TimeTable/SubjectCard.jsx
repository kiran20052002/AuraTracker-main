import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/url';

const SubjectCard = ({ subject, selectedDay, onDelete }) => {
    const token = localStorage.getItem('token'); 
  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/timetable/${selectedDay}/subject/${subject._id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
      },

      });
      onDelete();
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  return (
    <div className="p-4 shadow rounded-xl bg-white border">
      <div className="font-semibold text-lg">{subject.subject}</div>
      <div className="text-sm">{subject.type} | Room: {subject.room}</div>
      <div className="text-sm">{subject.startTime} - {subject.endTime}</div>
      <button onClick={handleDelete} className="mt-2 text-sm text-red-500 hover:underline">Delete</button>
    </div>
  );
};

export default SubjectCard;

