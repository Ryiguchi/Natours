export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // When the constructor is called, it will be ignored by the stack trace so we still get the original trace
    Error.captureStackTrace(this, this.constructor);
  }
}
