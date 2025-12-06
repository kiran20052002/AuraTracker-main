import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { BASE_URL } from "../../utils/url";
import axios from 'axios';

//Get the token
const token = getUserFromStorage();
//Add
export const AddSubjectAPI=async ({subject,credit,attendedClasses,totalClasses})=>{
    const response = await axios.post(`${BASE_URL}/subjects/create`,{
        subject,
        credit,
        attendedClasses,
        totalClasses,
    },{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });
    //return a promise
    return response.data;
}

//Register
export const listSubjectsAPI=async ()=>{
    const response = await axios.get(`${BASE_URL}/subjects/lists`,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });
    //return a promise
    return response.data;
}

// Update a subject
export const updateSubjectAPI = async ({ id, subject, credit, attendedClasses, totalClasses }) => {
    const response = await axios.put(
      `${BASE_URL}/subjects/update/${id}`,
      {
        subject,
        credit,
        attendedClasses,
        totalClasses,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the response data
  };



// Delete a subject
export const deleteSubjectAPI = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/subjects/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Full error object:", error);  // Log the complete error object
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to delete subject.");
      } else {
        throw new Error(error.message || "An unknown error occurred.");
      }
    }
  };
  
  
// Get a subject by ID
export const GetSubjectByIdAPI = async (id) => {
    const response = await axios.get(`${BASE_URL}/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the response data
  };
  
//Delete Task
export const deleteTaskAPI=async (id)=>{
    const response = await axios.delete(`${BASE_URL}/subjects/delete/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });
    //return a promise
    return response.data;
}