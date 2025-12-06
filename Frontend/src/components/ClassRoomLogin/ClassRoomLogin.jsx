import React from "react";
import logo from "../../assets/logo.png";
import Button from "@mui/material/Button";
import "./style.css";
import { useLocalContext } from "../../context/context";

function ClassRoomLogin() {
    const {login,loggedInUser} = useLocalContext();
    console.log(loggedInUser);
    
  return (
    <div className="login">
      <img className="login__logo" src={logo} alt="Classroom" />
      <Button variant="contained" color="default" onClick={() => login()}>
        Login Now!
      </Button>
    </div>
  );
}

export default ClassRoomLogin;
