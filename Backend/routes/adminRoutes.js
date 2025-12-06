import express from 'express';
import isAuthenticated from '../middlewares/isAuth.js';
import adminsController from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post('/api/v1/admins/register', adminsController.register);
adminRouter.post('/api/v1/admins/login', adminsController.login);
adminRouter.get('/api/v1/admins/profile', isAuthenticated, adminsController.profile);

adminRouter.put('/api/v1/admins/change-password', isAuthenticated, adminsController.changeAdminPassword);

adminRouter.put('/api/v1/admins/update-profile', isAuthenticated, adminsController.updateAdminProfile);




export default adminRouter;