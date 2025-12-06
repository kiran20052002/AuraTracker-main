import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendar } from "react-icons/fa";
import { registerAPI } from "../../services/users/userServices";
import AlertMessage from "../Alert/AlertMessage";
import { useNavigate } from "react-router-dom";

// Validation Schema
const validationSchema = Yup.object({
  username: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirming your password is required"),
  mobileNo: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  semester: Yup.number()
    .min(1, "Semester must be at least 1")
    .max(8, "Semester must be 8 or less")
    .required("Semester is required"),
  DOB: Yup.date().required("Date of Birth is required"),
  course: Yup.string().required("Course is required"),
  regnum: Yup.string().required("Registration number is required"),
  agreeToTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions"
  ),
});

const RegistrationForm = () => {
  const navigate = useNavigate();

  // Mutation
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register"],
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobileNo: "",
      semester: "",
      DOB: "",
      course: "",
      regnum: "",
      auraPoints:0,
      agreeToTerms: false,

    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      mutateAsync(values)
        .then((data) => {
          console.log(data);
        })
        .catch((e) => console.log(e));
    },
  });

  // Redirect on success
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [isPending, isError, isSuccess, error]);

  const courses = [
    "Mechanical Engineering",
    "Computer Science & Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Electronics and Communication Engineering",
    "Biotechnology",
  ];

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200"
    >
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        User Sign Up
      </h2>
      {isPending && <AlertMessage type="loading" message="Registering you in ..." />}
      {isError && <AlertMessage type="error" message={error?.response?.data?.message} />}
      {isSuccess && <AlertMessage type="success" message="Register Successful" />}

      {/* Name */}
      <div className="relative">
        <FaUser className="absolute top-3 left-3 text-gray-400" />
        <input
          id="username"
          type="text"
          {...formik.getFieldProps("username")}
          placeholder="Name"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.username && formik.errors.username && (
          <span className="text-xs text-red-500">{formik.errors.username}</span>
        )}
      </div>

      {/* Email */}
      <div className="relative">
        <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
        <input
          id="email"
          type="email"
          {...formik.getFieldProps("email")}
          placeholder="Email Address"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-xs text-red-500">{formik.errors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="relative">
        <FaLock className="absolute top-3 left-3 text-gray-400" />
        <input
          id="password"
          type="password"
          {...formik.getFieldProps("password")}
          placeholder="Password"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.password && formik.errors.password && (
          <span className="text-xs text-red-500">{formik.errors.password}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <FaLock className="absolute top-3 left-3 text-gray-400" />
        <input
          id="confirmPassword"
          type="password"
          {...formik.getFieldProps("confirmPassword")}
          placeholder="Confirm Password"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <span className="text-xs text-red-500">{formik.errors.confirmPassword}</span>
        )}
      </div>

      {/* Mobile Number */}
      <div className="relative">
        <FaPhone className="absolute top-3 left-3 text-gray-400" />
        <input
          id="mobileNo"
          type="text"
          {...formik.getFieldProps("mobileNo")}
          placeholder="Mobile Number"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.mobileNo && formik.errors.mobileNo && (
          <span className="text-xs text-red-500">{formik.errors.mobileNo}</span>
        )}
      </div>

      {/* Date of Birth */}
      <div className="relative">
        <FaCalendar className="absolute top-3 left-3 text-gray-400" />
        <input
          id="DOB"
          type="date"
          {...formik.getFieldProps("DOB")}
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.DOB && formik.errors.DOB && (
          <span className="text-xs text-red-500">{formik.errors.DOB}</span>
        )}
      </div>

      {/* Semester */}
      <div className="relative">
        <input
          id="semester"
          type="number"
          {...formik.getFieldProps("semester")}
          placeholder="Semester (1-8)"
          className="pl-4 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.semester && formik.errors.semester && (
          <span className="text-xs text-red-500">{formik.errors.semester}</span>
        )}
      </div>

      {/* Course */}
      <div>
        <select
          id="course"
          {...formik.getFieldProps("course")}
          className="pl-4 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
        {formik.touched.course && formik.errors.course && (
          <span className="text-xs text-red-500">{formik.errors.course}</span>
        )}
      </div>

      {/* Registration Number */}
      <div className="relative">
        <input
          id="regnum"
          type="text"
          {...formik.getFieldProps("regnum")}
          placeholder="Registration Number"
          className="pl-4 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.regnum && formik.errors.regnum && (
          <span className="text-xs text-red-500">{formik.errors.regnum}</span>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-center space-x-2">
        <input
          id="agreeToTerms"
          type="checkbox"
          {...formik.getFieldProps("agreeToTerms")}
          className="h-4 w-4 text-blue-600"
        />
        <label htmlFor="agreeToTerms" className="text-gray-700 text-sm">
          I agree to the terms and conditions.
        </label>
        {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
          <span className="text-xs text-red-500">{formik.errors.agreeToTerms}</span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
