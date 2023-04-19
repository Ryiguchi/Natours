import * as fs from 'fs';
import Tour from '../models/tourModel.mjs';
// import * as fsp from 'fs/promises';
// ROUTE HANDLERS
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

export const checkId = (req, res, next, val) => {
  console.log(`Tour id: ${val}`);
  const tour = tours.find((tour) => tour.id === +val);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }
  next();
};

export const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'All tours must have a name and a price',
    });
  }
  next();
};

export const getAllTours = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

export const getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

export const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

export const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<update tour here>',
    },
  });
};

export const deleteTour = (req, res) => {
  const id = +req.params.id;
  const newTours = tours.filter((tour) => tour.id !== id);

  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(newTours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};
