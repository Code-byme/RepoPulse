export class InvalidRepositoryUrlError extends Error {
  constructor(message = "Invalid GitHub repository URL") {
    super(message);
    this.name = "InvalidRepositoryUrlError";
  }
}

export class ServiceError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "ServiceError";
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ServiceError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
