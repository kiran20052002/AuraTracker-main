import React from "react";
import {
  AppBar,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";

import CreateClass from "../CreateClass/CreateClass";
import JoinClass from "../JoinClass/JoinClass";
import { useLocalContext } from "../../context/context";
import { Add, Apps } from "@mui/icons-material";

const AssignmentHeader = ({ children }) => {
  
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { setCreateClassDialog, setJoinClassDialog,loggedInUser,
    logout
  } =
    useLocalContext();

  const handleCreate = () => {
    handleClose();
    setCreateClassDialog(true);
  };

  const handleJoin = () => {
    handleClose();
    setJoinClassDialog(true);
  };

  return (
    <div className="flex flex-col">
      <AppBar position="static" className="bg-white text-black shadow-none">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center">
            {children}
             <img
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
              alt="Classroom"
              className="h-6"
            />
            <Typography
              variant="h6"
              className="text-gray-600 text-lg ml-2 cursor-pointer"
            >
              Classroom
            </Typography> 
          </div>
          <div className="flex items-center gap-4">
            <IconButton
              onClick={handleClick}
              className="text-gray-600 hover:text-primary cursor-pointer"
            >
              <Add />
            </IconButton>
            <IconButton className="text-gray-600 hover:text-primary cursor-pointer"></IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleJoin}>Join Class</MenuItem>
              <MenuItem onClick={handleCreate}>Create Class</MenuItem>
            </Menu>
            <div>
              <Avatar onClick={() => logout()}  src={loggedInUser?.photoURL} />
            </div>
            
            
          </div>
          
        </div>
      </AppBar>
      <CreateClass/>
      <JoinClass/>
    </div>
  );
};

export default AssignmentHeader;
