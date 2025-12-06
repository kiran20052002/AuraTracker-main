import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { BASE_URL } from "../../utils/url";
import axios from 'axios';

const token = getUserFromStorage();

// Login
export const loginAPI = async ({ email, password,username, mobileNo, semester, DOB, course, regnum,auraPoints }) => {
    const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
        username,
        mobileNo,
        semester,
        DOB,
        course,
        regnum,
        auraPoints,
    });
    // Return a promise
    return response.data;
}

// Register
export const registerAPI = async ({ email, password, username, mobileNo, semester, DOB, course, regnum,auraPoints }) => {
    const response = await axios.post(`${BASE_URL}/users/register`, {
        email,
        password,
        username,
        mobileNo,
        semester,
        DOB,
        course,
        regnum,
        auraPoints,
    });
    // Return a promise
    return response.data;
}

// Change Password
export const changePasswordAPI = async (newPassword) => {
    const response = await axios.put(`${BASE_URL}/users/change-password`, {
        newPassword,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    // Return a promise
    return response.data;
}

// Update Profile
export const updateProfileAPI = async ({ email, username, mobileNo, semester, DOB, course, regnum,auraPoints }) => {
    const response = await axios.put(`${BASE_URL}/users/update-profile`, {
        email,
        username,
        mobileNo,
        semester,
        DOB,
        course,
        regnum,
        auraPoints,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    // Return a promise
    return response.data;
}

