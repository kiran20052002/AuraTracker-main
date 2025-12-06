import express from 'express';

import isAuthenticated from '../middlewares/isAuth.js';
import examController from '../controllers/examController.js';
const examRouter = express.Router();

// Add a new subject
examRouter.post(
  '/api/v1/exams/create',
  isAuthenticated,
  examController.create
);

// List all exams
examRouter.get(
  '/api/v1/exams/lists',
  isAuthenticated,
  examController.lists
);

// Get a subject by ID
examRouter.get(
  '/api/v1/exams/:id',
  isAuthenticated,
  examController.getById
);

// Update a subject by ID
examRouter.put(
  '/api/v1/exams/update/:subjectId',
  isAuthenticated,
  examController.update
);

// Delete a subject by ID
examRouter.delete(
  '/api/v1/exams/delete/:id',
  isAuthenticated,
  examController.delete
);

export default examRouter;
