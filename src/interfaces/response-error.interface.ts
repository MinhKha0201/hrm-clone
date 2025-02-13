export interface IResponseError {
  timestamp: string;
  status: boolean;
  statusCode: number;
  error: string;
  errorCode?: string;
  message: string;
  details?: [
    {
      property: string;
      code: string;
      message: string;
    }
  ];
}
