import express from 'express';

import isAuthenticated from '../middlewares/isAuth.js';
import attendanceController from '../controllers/attendanceController.js';

const attendanceRouter = express.Router();

// Add a new subject
attendanceRouter.post(
  '/api/v1/subjects/create',
  isAuthenticated,
  attendanceController.create
);

// List all subjects
attendanceRouter.get(
  '/api/v1/subjects/lists',
  isAuthenticated,
  attendanceController.lists
);

// Get a subject by ID
attendanceRouter.get(
  '/api/v1/subjects/:id',
  isAuthenticated,
  attendanceController.getById
);

// Update a subject by ID
attendanceRouter.put(
  '/api/v1/subjects/update/:subjectId',
  isAuthenticated,
  attendanceController.update
);

// Delete a subject by ID
attendanceRouter.delete(
  '/api/v1/subjects/delete/:id',
  isAuthenticated,
  attendanceController.delete
);

export default attendanceRouter;
