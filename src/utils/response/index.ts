export const createTextResponse = (
    message: string,
    statusCode: number,
  ): { statusCode: number; message: string } => {
    return {
      message,
      statusCode,
    };
  };
  
  export const createResponse = (
    data: any,
    total: number,
    message: string,
    statusCode: number,
  ): { data: any; total: number; message: string; statusCode: number } => {
    return {
      data,
      total,
      message: message,
      statusCode,
    };
  };