export enum ResponseStatus {
  Ok,
  Error,
  Unsent,
}
export enum ErrorType {
  BadRequest = "bad request",
  UnprocessableEntity = "unprocessable entity",
  InternalError = "internal error",
  Unauthorized = "unauthorized",
}
interface ErrorResponse<T> {
  status: ResponseStatus.Error;
  type: ErrorType;
  message?: string;
  data?: T;
}
interface OkResponse<T> {
  status: ResponseStatus.Ok;
  data?: T;
}
interface UnsentResponse {
  status: ResponseStatus.Unsent;
}
export type Response<T = undefined> =
  | ErrorResponse<T>
  | OkResponse<T>
  | UnsentResponse;
