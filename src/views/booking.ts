import { APIResponse, JSONResponseWriter } from "./base";
import BookingResponse from "../responses/booking";
import { Response } from "express";

class BookingView extends JSONResponseWriter<BookingResponse> {
  sendJSONArray(res: Response, arrayAPIResponse: APIResponse<BookingResponse[]>): void {
    res.status(this._apiResponse.status).json(arrayAPIResponse);
  }
}

export default BookingView;