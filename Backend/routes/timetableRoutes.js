import express from 'express';
import { getTimetableByDay, updateTimetable, addSubject, deleteSubject } from '../controllers/timetableController.js';
import isAuthenticated from '../middlewares/isAuth.js';
import isProtected from '../middlewares/protected.js';


const timetableRouter = express.Router();

timetableRouter.get('/api/v1/timetable/:day', isProtected, getTimetableByDay);
timetableRouter.post('/api/v1/timetable', isProtected, updateTimetable);
timetableRouter.post('/api/v1/timetable/:day/subject', isProtected, addSubject);
timetableRouter.delete('/api/v1/timetable/:day/subject/:subjectId', isProtected, deleteSubject);

export default timetableRouter;