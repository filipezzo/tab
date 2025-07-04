import {
  InternalServerError,
  MethodNotAllowed,
  NotFoundError,
  ValidationError,
} from "./errors";

export function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  const publicError = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });
  response.status(publicError.statusCode).json(publicError);
}

export function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowed();
  response.status(publicError.statusCode).json(publicError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
