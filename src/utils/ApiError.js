class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = "Something went wrong!",
    errors = [],
    stack
  ) {
    super(message); // calls Error constructor so 'message' + 'stack' get set
    this.statusCode = statusCode;
    this.errors = errors;
    this.message = message;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack; // shows where the error was created.
    } else {
      Error.captureStackTrace(this, this.constructor); // creating a clean stack trace automatically
    }
  }
}

export { ApiError };
