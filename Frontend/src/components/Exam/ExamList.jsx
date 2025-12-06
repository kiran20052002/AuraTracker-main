// ExamList.jsx
import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getExamsAPI, createExamAPI, updateExamAPI } from "../../services/exam/examService";
import AlertMessage from "../Alert/AlertMessage";
import { useFormik } from "formik";
import * as Yup from "yup";
import { deleteExamAPI } from "../../services/exam/examService";
import DashboardNavbar from "../Navbar/DashboardNavbar";
const ExamList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Fetch exams
  const { data, isError, isLoading, error, refetch } = useQuery({
    queryFn: getExamsAPI,
    queryKey: ["list-exams"],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createExamAPI,
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateExamAPI,
    onSuccess: () => {
      refetch();
      setIsUpdateModalOpen(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteExamAPI,
    onSuccess: () => refetch(),
  });

  const openUpdateModal = (exam) => {
    setSelectedExam(exam);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id);
  };

  const ExamForm = ({ initialValues, onSubmit }) => {
    const formik = useFormik({
      initialValues,
      validationSchema: Yup.object({
        subject: Yup.string().required("Subject is required"),
        date: Yup.string().required("Date is required"),
        time: Yup.string().required("Time is required"),
        roomNo: Yup.string().required("Room Number is required"),
      }),
      onSubmit,
    });

    return (
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            {...formik.getFieldProps("subject")}
            className="w-full border p-2 rounded-md"
          />
          {formik.touched.subject && formik.errors.subject && (
            <p className="text-red-500 text-sm">{formik.errors.subject}</p>
          )}
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            {...formik.getFieldProps("date")}
            className="w-full border p-2 rounded-md"
          />
          {formik.touched.date && formik.errors.date && (
            <p className="text-red-500 text-sm">{formik.errors.date}</p>
          )}
        </div>

        <div>
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            {...formik.getFieldProps("time")}
            className="w-full border p-2 rounded-md"
          />
          {formik.touched.time && formik.errors.time && (
            <p className="text-red-500 text-sm">{formik.errors.time}</p>
          )}
        </div>

        <div>
          <label htmlFor="roomNo">Room Number</label>
          <input
            type="text"
            id="roomNo"
            {...formik.getFieldProps("roomNo")}
            className="w-full border p-2 rounded-md"
          />
          {formik.touched.roomNo && formik.errors.roomNo && (
            <p className="text-red-500 text-sm">{formik.errors.roomNo}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    );
  };

  return (
    <div>
        {/* <DashboardNavbar/> */}
    <div className="max-w-4xl mx-auto my-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exams</h2>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
      >
        Add Exam
      </button>

      {isLoading && <AlertMessage type="loading" message="Loading Exams..." />}
      {isError && (
        <AlertMessage
          type="error"
          message={error?.response?.data?.message || "Something went wrong"}
        />
      )}

      <ul className="space-y-4">
        {Array.isArray(data) &&
          data.map((exam) => (
            <li
              key={exam?._id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
            >
              <div>
                <span className="text-gray-800">{exam?.subject}</span>
                <span className="ml-4 text-gray-500">
                  {new Date(exam?.date).toLocaleDateString()} {exam?.time}
                </span>
                <span className="ml-4 text-gray-500">Room: {exam?.roomNo}</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => openUpdateModal(exam)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(exam?._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
      </ul>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl mb-4">Create Exam</h3>
            <ExamForm
              initialValues={{ subject: "", date: "", time: "", roomNo: "" }}
              onSubmit={(values) => createMutation.mutate(values)}
            />
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="mt-4 text-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl mb-4">Update Exam</h3>
            <ExamForm
              initialValues={selectedExam}
              onSubmit={(values) => updateMutation.mutate({ ...values, id: selectedExam._id })}
            />
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="mt-4 text-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ExamList;