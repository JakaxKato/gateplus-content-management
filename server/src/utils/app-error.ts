export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly errors?: FieldError[];

  constructor(statusCode: number, message: string, errors?: FieldError[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'AppError';
  }

  static badRequest(message: string, errors?: FieldError[]): AppError {
    return new AppError(400, message, errors);
  }

  static unauthorized(message = 'Tidak terautentikasi. Silakan login terlebih dahulu.'): AppError {
    return new AppError(401, message);
  }

  static notFound(message: string): AppError {
    return new AppError(404, message);
  }

  static conflict(message: string): AppError {
    return new AppError(409, message);
  }
}
