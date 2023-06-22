export interface ResponseApi<T> {
  status_code: number;
  error: string;
  data: T;
}
