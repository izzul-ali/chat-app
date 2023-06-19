import { Response } from 'express';

interface ResponseApi<T> {
  status_code: number;
  error: string;
  data: T;
}

export default function response<T>(res: Response, status_code: number, error: string, data: T) {
  return res.status(status_code).json({
    status_code,
    error,
    data,
  } as ResponseApi<T>);
}
