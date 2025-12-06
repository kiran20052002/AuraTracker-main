import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { BASE_URL } from "../../utils/url";
import axios from 'axios';

//Get the token
const token = getUserFromStorage();
//Add
export const AddTaskAPI=async ({name,type})=>{
    const response = await axios.post(`${BASE_URL}/tasks/create`,{
        name,
        type,
    },{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });
    //return a promise
    return response.data;
}

//Register
export const listTasksAPI=async ()=>{
    const response = await axios.get(`${BASE_URL}/tasks/lists`,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });
    //return a promise
    return response.data;
}

//Update
export const updateTaskAPI=async ({name,type,id})=>{
    const response = await axios.put(`${BASE_URL}/tasks/update/${id}`,{
        name,
        type,
    },{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });
    //return a promise
    return response.data;
}


//Delete
export const deleteTaskAPI=async (id)=>{
    const response = await axios.delete(`${BASE_URL}/tasks/delete/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });
    //return a promise
    return response.data;
}