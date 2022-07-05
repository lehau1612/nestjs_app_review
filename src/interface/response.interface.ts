// success: true => message, data
// success: false => errorMessage, error

export interface IResponse {
    status: number;
    message: string;
    data: any;
    error: any;
  }
  