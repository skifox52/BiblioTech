import expressAsyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import { RequestHandler, Request, Response, NextFunction } from "express"

//Protect User
export const protect: RequestHandler = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"]
      const token = authHeader && authHeader.split(" ")[1]
      if (!token) {
        res.status(400)
        throw new Error("Unauthorized! No token!")
      }
      const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
      const { _id, role }: any = tokenData
      req.user = { _id, role }
      next()
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Protect Employe
export const protectEmployee: RequestHandler = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"]
      const token = authHeader && authHeader.split(" ")[1]
      if (!token) {
        res.status(400)
        throw new Error("Unauthorized! No token!")
      }
      const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
      const { _id, role }: any = tokenData
      if (role !== "Employe") {
        res.status(400)
        throw new Error("You are not authorized! You're not an employee!")
      }
      req.user = { _id, role }
      next()
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Protect Admin
export const protectAdmin: RequestHandler = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"]
      const token = authHeader && authHeader.split(" ")[1]
      if (!token) {
        res.status(400)
        throw new Error("Unauthorized! No token!")
      }
      const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
      const { _id, role }: any = tokenData
      if (role !== "Admin") {
        res.status(400)
        throw new Error("You are not authorized! You're not an Admin!")
      }
      req.user = { _id, role }
      next()
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
