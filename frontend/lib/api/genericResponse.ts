export type ResponseRequest<T> = {
  status: number;
  content: T;
  error: { error: string; msg: string } | null;
};
