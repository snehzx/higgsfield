export class ApiResponse<T> {
  statusCode: number;
  data: T;

  constructor(statusCode: number, data: T) {
    this.statusCode = statusCode;
    this.data = data;
  }
}
