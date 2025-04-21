import { NextFunction, Request, Response } from 'express'

export const AsyncWrapper = (
  promiseFunction: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      return Promise.resolve(promiseFunction(req, res, next))
    } catch (err) {
      next(err)
    }
  }
}
