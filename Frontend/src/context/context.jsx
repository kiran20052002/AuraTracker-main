import { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "../components/lib/Firebase";
const AddContext = createContext();

export function useLocalContext() {
  return useContext(AddContext);
}
export function ContextProvider({ children }) {
  const [createClassDialog, setCreateClassDialog] = useState(false);
  const [joinClassDialog,setJoinClassDialog] = useState(false);
  const [loggedInUser,setLoggedInUser] = useState(null);
  const [loggedInMail,setLoggedInMail] = useState('');
  const login = () => {
    auth.signInWithPopup(provider);
  }
  const logout = () => {
    auth.signOut();
  }
  useEffect(()=> {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setLoggedInMail(authUser.email);
        setLoggedInUser(authUser);
      }
      else{
        setLoggedInMail('');
        setLoggedInUser(null);
      }
    });
    return () => {
      unsubcribe();
    }
  },[])
  const value = {createClassDialog,setCreateClassDialog,joinClassDialog,setJoinClassDialog
    ,login,logout,loggedInUser,loggedInMail
  };
  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}
