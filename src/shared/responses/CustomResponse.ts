export class CustomResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: MetaData;

  constructor(success: boolean, message: string, data: T, meta?: MetaData) {
    this.success = success;
    this.message = message;
    this.meta = meta;
    this.data = data;
  }
}
