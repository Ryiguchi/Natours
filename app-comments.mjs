// const express = require('express');
import express from 'express';
import fs from 'fs';
import fsp from 'fs/promises';
// const fs = require('node:fs');

const app = express();

// middleware that attaches the body on to the request
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint ...');
// });

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  // can add multiple params: /:id/:name
  // or optional: /:id/:name? (will return "undefined" for name if not specified)
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//callback version

// app.post('/api/v1/tours', (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);
//   fs.writeFile(
//     './dev-data/data/tours-simple.json',
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
//   res.send('Done');
// });

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  const promise = fsp.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours)
  );

  // 201 is for created
  (async function () {
    try {
      await promise;
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    } catch (error) {}
  })();
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<update tour here>',
    },
  });
});

const getPromise = (data) =>
  fsp.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(data));

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = +req.params.id;
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  }

  const newTours = tours.filter((tour) => tour.id !== id);

  (async function (data) {
    try {
      await getPromise(data);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {}
  })(newTours);
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
