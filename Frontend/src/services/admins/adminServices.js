import { getAdminFromStorage } from "../../utils/getAdminFromStorage";
import { BASE_URL } from "../../utils/url";
import axios from 'axios';

const token = getAdminFromStorage();

// Login
export const loginAPI = async ({ email, password,username}) => {
    const response = await axios.post(`${BASE_URL}/admins/login`, {
        email,
        password,
        username,
        
    });
    // Return a promise
    return response.data;
}

// Register
export const registerAPI = async ({ email, password, username}) => {
    const response = await axios.post(`${BASE_URL}/admins/register`, {
        email,
        password,
        username,

    });
    // Return a promise
    return response.data;
}

// Change Password
export const changePasswordAPI = async (newPassword) => {
    const response = await axios.put(`${BASE_URL}/admins/change-password`, {
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
export const updateProfileAPI = async ({ email, username}) => {
    const response = await axios.put(`${BASE_URL}/admins/update-profile`, {
        email,
        username,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    // Return a promise
    return response.data;
}

