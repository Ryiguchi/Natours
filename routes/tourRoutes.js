import express from 'express';
import * as tourController from '../controllers/tourController.js';
import * as authController from '../controllers/authenticationController.js';
import reviewRouter from './reviewRoutes.js';
// ROUTES

const router = express.Router();

// param middleware
// router.param('id', tourController.checkId);

// tells express to use the review router for routes that match
// just mounting a router like in app.mjs - router is just midddleware
router.use('/:tourId/reviews', reviewRouter);
// router.use('/:tourId/reviews/:reviewId', reviewRouter);

// SPECIAL
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

export default router;
