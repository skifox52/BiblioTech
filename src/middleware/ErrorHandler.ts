import { ErrorRequestHandler, Request, Response, NextFunction } from "express"

const ErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500
  res.status(statusCode).json({
    message: err.message,
    stack: err.stack,
  })
}

export default ErrorHandler
