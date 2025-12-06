import express from 'express';

import isAuthenticated from '../middlewares/isAuth.js';
import taskController from '../controllers/taskController.js';



const taskRouter=express.Router();
//add
taskRouter.post('/api/v1/tasks/create',isAuthenticated, taskController.create);
//lists
taskRouter.get('/api/v1/tasks/lists',isAuthenticated, taskController.lists);
//update
taskRouter.put(
    "/api/v1/tasks/update/:TaskId",
    isAuthenticated,
    taskController.update
  );
  // delete
  taskRouter.delete(
    "/api/v1/tasks/delete/:id",
    isAuthenticated,
    taskController.delete
  );


export default taskRouter;