import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down ...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

(async () => {
  const { app } = await import('./app.js');
  // must set port to process.env.PORT for heroku to work
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
})();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down ...');
  // server.close(() => {
  //   process.exit(1);
  // });
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received.  Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
