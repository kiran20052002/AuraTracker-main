import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginAPI } from "../../services/admins/adminServices";
import AlertMessage from "../Alert/AlertMessage";
import { loginAction } from "../../redux/slice/adminAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//validations
const validationSchema=Yup.object({
    email:Yup.string().email("Invalid").required("Email is required"),
    password:Yup.string()
    .min(5,"Password must be at least 5 characters")
    .required("Password is required"),
})
const AdminLoginForm = () => {
    //Navigate
    const navigate=useNavigate();
    //Dispatch
    const dispatch=useDispatch();
    //Mutation
    const {mutateAsync,isPending,isError,error,isSuccess}=useMutation({
        mutationFn:loginAPI,
        mutationKey:["admin-login"]
    })
    // console.log(mutation);
    const formik=useFormik({
        initialValues:{
            email:"",
            password:"",
        },
        validationSchema:validationSchema,
        //Submit
        onSubmit:(values)=>{
            // console.log(values);
            //http request
            mutateAsync(values)
            .then((data)=>{
                // console.log(data);
                
                //dispatch
                dispatch(loginAction(data));
                //save the admin into localStorage
                localStorage.setItem("adminInfo",JSON.stringify(data));
            
                // save the token
                console.log("Saving token in localStorage",data.token);
                localStorage.setItem("token", data.token);

            }).catch(e=>console.log(e));
        }
    });
    //Redirect
    useEffect(()=>{
        setTimeout(()=>{
            if(isSuccess){
                navigate('/adminPage/profile');
            }
        },3000);
    },[isPending,isError,isSuccess,error]);
  return (
    <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto my-10 bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200">
      <h2 className="text-3xl font-semibold text-center text-gray-800">
       Admin Login
      </h2>
      {/* Display messages */}
      {isPending && <AlertMessage type='loading' message='Login you in ...'/> }
      {isError && <AlertMessage type='error' message={error.response.data.message} /> }
      {isSuccess && <AlertMessage type='success' message='Login Successful'/> }

      <p className="text-sm text-center text-gray-500">
        Login to access your account
      </p>

      {/* Input Field - Email */}
      <div className="relative">
        <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
        <input
          id="email"
          type="email"
          {...formik.getFieldProps("email")}
          placeholder="Email"
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-xs text-red-500">{formik.errors.email}</span>
        )}
      </div>

      {/* Input Field - Password */}
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

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Login
      </button>
    </form>
  );
};

export default AdminLoginForm;