import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/url';

const AddSubjectForm = ({ onSubjectAdded , selectedDay}) => {
  const initialState = {
    day: selectedDay,
    startTime: '',
    endTime: '',
    room: '',
    subject: '',
    type: '',
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData({
      ...initialState,
      day: selectedDay,
    });
  }, [selectedDay]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { day, ...rest } = formData;
    const token = localStorage.getItem('token');

    await axios.post(`${BASE_URL}/timetable/${day}/subject`, rest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFormData({
      day: 'Monday',
      startTime: '',
      endTime: '',
      room: '',
      subject: '',
      type: '',
    });
    onSubjectAdded(); 
  } catch (err) {
    console.error('Error adding subject:', err);
  }
};

  



  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-4">
      <select
        name="day"
        value={formData.day}
        onChange={handleChange}
        className="border p-2 rounded col-span-2"
        required
      >
        {days.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        name="type"
        placeholder="Type (Lecture/Lab)"
        value={formData.type}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        name="room"
        placeholder="Room"
        value={formData.room}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="time"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        type="time"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="col-span-2 bg-blue-600 text-white rounded py-2">
        Add Subject
      </button>
    </form>
  );
};

export default AddSubjectForm;
