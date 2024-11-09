import { Response } from 'express';

class RequestHandlers {
  public static Handler(res: Response, code: number, message: string | unknown) {
    res.status(code).json(RequestHandlers.evolve(message));
  }
  private static evolve(inData: any) {
    switch (typeof inData) {
    case 'string':
      if (inData === 'emptyArray') {
        inData = {
          data: []
        };
      } else {
        inData = {
          data: inData
        };
      }
      break;
    case 'object':
      if (inData[0]) {
        inData = {
          data: [...inData]
        };
      } else {
        inData = {
          data: { ...inData }
        };
      }
      break;
    }
    return inData;
  }
}
export default RequestHandlers.Handler;
