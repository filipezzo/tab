export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Server internal error", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact suport.";
    this.statusCode = 500;
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
