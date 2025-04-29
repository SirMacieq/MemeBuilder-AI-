export default class ResponseError {
  public error: any;
  public msg: string | null;

  constructor({ error, msg }: { error: any; msg: string | null }) {
    this.error = error;
    this.msg = msg;
  }
}
