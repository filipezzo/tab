export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Server internal error", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact suport.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class MethodNotAllowed extends Error {
  constructor() {
    super("Method not allowed for this endpoint");
    this.name = "MethodNotAllowed";
    this.action = "verify HTTP method.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ message, cause }) {
    super(message || "Service is not available. Try again later.", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verify if the service is available.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ message, cause, action }) {
    super(message || "There was an error validating the data", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Please provide another creedentials.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}
