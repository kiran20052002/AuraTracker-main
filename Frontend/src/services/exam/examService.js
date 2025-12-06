// examService.js
import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

const token = getUserFromStorage();

// List Exams
export const getExamsAPI = async () => {
  const response = await axios.get(`${BASE_URL}/exams/lists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create Exam
export const createExamAPI = async ({ subject, date, time, roomNo }) => {
  const response = await axios.post(
    `${BASE_URL}/exams/create`,
    { subject, date, time, roomNo },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Update Exam
export const updateExamAPI = async ({ id, subject, date, time, roomNo }) => {
  const response = await axios.put(
    `${BASE_URL}/exams/update/${id}`,
    { subject, date, time, roomNo },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Delete Exam
export const deleteExamAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/exams/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
