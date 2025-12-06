import React from 'react';
import { getAdminFromStorage } from '../../utils/getAdminFromStorage';
import { Navigate } from 'react-router-dom';

const AdminAuthRoute=({children})=>{
    const token=getAdminFromStorage();
    if(token){
        return children;
    }else{
        return <Navigate to="/" />
    }
};

export default AdminAuthRoute;