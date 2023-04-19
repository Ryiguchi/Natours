import express from 'express';

import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authenticationController.js';

// ROUTES

const router = express.Router();

// AUTHORIZATION
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// USER ACCESS (protected)
// Just middleware, so every route that comes after this point will get this (DON'T MOVE)
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
// 'photo' is the field in body that photo will be in- will put info on req.Object
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// ADMIN ACCESS (protected and restricted to admin)
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
