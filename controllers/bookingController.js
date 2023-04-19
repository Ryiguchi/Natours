import Stripe from 'stripe';
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Booking from '../models/bookinsModel.js';
import * as factory from './handlerFactory.js';
import User from '../models/userModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get the current booked tour
  const tour = await Tour.findById(req.params.tourID);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    // session info
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourID
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    mode: 'payment',
    // pass in some information about the session that we're creating so that later, we can get access to the session object to use to create a new booking in our DB
    client_reference_id: req.params.tourID,
    // product info
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  // 3) create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// temp solution for before site was live
// export const createBookingCheckout = catchAsync(async (req, res, next) => {
//   const { tour, user, price } = req.query;

//   if (!tour || !user || !price) return next();

//   await Booking.create({ tour, user, price });
//   // instead of calling next, redirect back to the same page without the query string which would go back to this middleware and fail the above statement and go to next. this just hides the info in the query string
//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (
    await User.findOne({
      email: session.customer_email,
    })
  ).id;
  const price = session.line_items[0].price_data.unit_amount / 100;
  await Booking.create({ tour, user, price });
};

export const webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    // res will go back to stripe since they will send the request
    return res.res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === 'checkout.session.complete')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

export const getAllBookings = factory.getAll(Booking);
export const getBooking = factory.getOne(Booking);
export const createBooking = factory.createOne(Booking);
export const updateBooking = factory.updateOne(Booking);
export const deleteBooking = factory.deleteOne(Booking);
