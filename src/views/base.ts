import { Response } from 'express';

type APIResponse<T> = {
  data?: T;
  message: string;
  status: number;
  error?: string;
}

abstract class JSONResponseWriter<X> {
  _apiResponse: APIResponse<X>;

  get apiResponse(): APIResponse<X> {
    return this._apiResponse;
  }

  set apiResponse(apiResponse: APIResponse<X>) {
    this._apiResponse = apiResponse;
  }

  send(res: Response): void {
    res.status(this._apiResponse.status).json(this._apiResponse);
  }
}

export { JSONResponseWriter, APIResponse };