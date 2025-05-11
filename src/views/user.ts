import { APIResponse, JSONResponseWriter } from "./base";
import UserResponse from "../responses/user";
import { Response } from "express";

class UserView extends JSONResponseWriter<UserResponse> {
  sendJSONArray(res: Response, arrayAPIResponse: APIResponse<UserResponse[]>): void {
    res.status(this._apiResponse.status).json(arrayAPIResponse);
  }
}

export default UserView;