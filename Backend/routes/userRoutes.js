import express from 'express';
import isAuthenticated from '../middlewares/isAuth.js';
import usersController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/api/v1/users/register', usersController.register);
userRouter.post('/api/v1/users/login', usersController.login);
userRouter.get('/api/v1/users/profile', isAuthenticated, usersController.profile);

userRouter.put('/api/v1/users/change-password', isAuthenticated, usersController.changeUserPassword);

userRouter.put('/api/v1/users/update-profile', isAuthenticated, usersController.updateUserProfile);

userRouter.post('/api/v1/users/daily-check', isAuthenticated, usersController.dailyCheckIn);

userRouter.post('/api/v1/users/update-points',isAuthenticated, usersController.updateAuraPoints);

userRouter.put('/api/v1/users/update-badges',isAuthenticated, usersController.updateBadges);


export default userRouter;