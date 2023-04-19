import path from 'node:path';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import csp from 'express-csp';
import compression from 'compression';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from './routes/viewRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import cspOptions from './utils/csp.js';

export const app = express();

// allows us to read the changed http header from huroku
app.enable('trust proxy');

//  -- set view engine
app.set('view engine', 'pug');
//  -- set template folder
app.set('views', path.join(process.cwd(), 'views'));

// 1) GLOBAL MIDDLEWARES

//  -- serving static files
app.use(express.static(path.join(process.cwd(), 'public')));

//  -- set security HTTP headers
app.use(helmet());
//  -- content security policy whitelist
csp.extend(app, cspOptions);

//  --  development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//  -- limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//  -- body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
//  -- parse url encoded data from req from form submission
// extended - lets us pass in more complicated data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//  -- parses cookies
app.use(cookieParser());

//  -- data sanitization against NoSQL query injection
app.use(mongoSanitize());
//  -- data sanitization against XSS
app.use(xss());
//  -- prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// -- compresses all TEXT that is sent to client
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//  -- all errors end up here!
app.use(globalErrorHandler);
