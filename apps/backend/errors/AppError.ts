// errorHandler reads `status` to pick the response code.
export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
