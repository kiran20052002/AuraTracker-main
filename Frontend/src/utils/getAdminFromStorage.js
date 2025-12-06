export const getAdminFromStorage=()=>{
    const token=JSON.parse(localStorage.getItem("adminInfo") || null);
    return token?.token;
};

