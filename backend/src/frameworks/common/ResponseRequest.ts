import ResponseError from "./ResponseError";

export default class ResponseRequest {
  public status: number | boolean;
  public error: ResponseError | string | null;
  public content: any;
  public temporaryPassword: string | undefined;

  constructor({
    status = false,
    error = null,
    content = null,
  }: {
    status: number | boolean;
    error: ResponseError | string | null;
    content: any;
  }) {
    this.status = status;
    this.error = error;
    this.content = content;
  }
}
