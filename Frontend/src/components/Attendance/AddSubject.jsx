import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AddSubjectAPI,
  updateSubjectAPI,
  GetSubjectByIdAPI,
} from "../../services/attendance/attendanceService";

const validationSchema = Yup.object({
  subject: Yup.string().required("Subject name is required"),
  credit: Yup.number()
    .required("Credits are required")
    .min(0, "Credits must be 0 or more"),
  attendedClasses: Yup.number()
    .required("Attended classes is required")
    .min(0, "Must be 0 or more"),
  totalClasses: Yup.number()
    .required("Total classes is required")
    .min(1, "Must be 1 or more"),
});

const AddSubject = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the subject ID for editing
  const isEditing = Boolean(id); // Determine if we are in editing mode

  // Fetch the existing subject details when editing
  const { data: subjectData, isLoading: isSubjectLoading } = useQuery({
    queryKey: ["GetSubject", id],
    queryFn: () => GetSubjectByIdAPI(id),
    enabled: isEditing, // Only fetch when editing
  });

  const { mutateAsync: addSubject, isLoading: isAdding } = useMutation({
    mutationFn: AddSubjectAPI,
  });

  const { mutateAsync: updateSubject, isLoading: isUpdating } = useMutation({
    mutationFn: updateSubjectAPI,
  });

  const formik = useFormik({
    initialValues: {
      subject: "",
      credit: 0,
      attendedClasses: 0,
      totalClasses: 1,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateSubject({ id, ...values });
        } else {
          await addSubject(values);
        }
        navigate("/dashboard"); // Redirect after success
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error submitting form. Please try again.");
      }
    },
  });

  // Populate form with existing data when editing
  useEffect(() => {
    if (isEditing && subjectData) {
      formik.setValues({
        subject: subjectData.subject || "",
        credit: subjectData.credit || 0,
        attendedClasses: subjectData.attendedClasses || 0,
        totalClasses: subjectData.totalClasses || 1,
      });
    }
  }, [isEditing, subjectData]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Subject" : "Add New Subject"}
      </h2>

      {/* Subject Name */}
      <div className="mb-4">
        <label htmlFor="subject" className="block text-gray-700 font-medium">
          Subject Name
        </label>
        <input
          type="text"
          id="subject"
          {...formik.getFieldProps("subject")}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Enter subject name"
        />
        {formik.touched.subject && formik.errors.subject && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.subject}</p>
        )}
      </div>

      {/* Credits */}
      <div className="mb-4">
        <label htmlFor="credit" className="block text-gray-700 font-medium">
          Credits
        </label>
        <input
          type="number"
          id="credit"
          {...formik.getFieldProps("credit")}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Enter credits"
        />
        {formik.touched.credit && formik.errors.credit && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.credit}</p>
        )}
      </div>

      {/* Attended Classes */}
      <div className="mb-4">
        <label
          htmlFor="attendedClasses"
          className="block text-gray-700 font-medium"
        >
          Attended Classes
        </label>
        <input
          type="number"
          id="attendedClasses"
          {...formik.getFieldProps("attendedClasses")}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Enter attended classes"
        />
        {formik.touched.attendedClasses && formik.errors.attendedClasses && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.attendedClasses}
          </p>
        )}
      </div>

      {/* Total Classes */}
      <div className="mb-4">
        <label
          htmlFor="totalClasses"
          className="block text-gray-700 font-medium"
        >
          Total Classes
        </label>
        <input
          type="number"
          id="totalClasses"
          {...formik.getFieldProps("totalClasses")}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Enter total classes"
        />
        {formik.touched.totalClasses && formik.errors.totalClasses && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.totalClasses}
          </p>
        )}
      </div>

      {/* Button Container */}
      <div className="flex justify-between items-center mt-6">
        
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAdding || isUpdating || isSubjectLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition "
          >
            {isEditing ? "Update Subject" : "Add Subject"}
          </button>
        
      </div>
    </form>
  );
};

export default AddSubject;
