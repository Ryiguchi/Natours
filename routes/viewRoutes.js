import express from 'express';
import * as viewsController from '../controllers/viewsController.js';
import * as authController from '../controllers/authenticationController.js';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

// use to attatch a variable to req.locals to use in templates
router.use(viewsController.alerts);
// isloggedIn checks for cookie from client and puts the user on req.locals for templates,
// protect checks for bearer token and put user in req.user for next middleware
router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

export default router;
