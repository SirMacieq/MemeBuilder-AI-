export class ValidationError {
  public field: string | null;
  public msg: string | null;

  constructor({ field = null, msg = null }) {
    this.field = field;
    this.msg = msg;
  }
}
