export class ApiResponse<T = unknown> {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly message: string;
  public readonly data?: T;

  constructor(statusCode: number, success: boolean, message: string, data?: T) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
