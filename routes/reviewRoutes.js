import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import * as authController from '../controllers/authenticationController.js';

// each router only has access to the params from their routes. here we merge params so that routes that are rerouted from tour with the tour ID will still have access to the params
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourandUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

export default router;
