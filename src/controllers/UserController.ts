import expressAsyncHandler from "express-async-handler"
import { Types } from "mongoose"
import { Request, Response } from "express"
import { compare, hash } from "bcrypt"
import RefreshTokenModel from "../models/RefreshTokenModel.js"
import UserModel from "../models/UserModel.js"
import jwt from "jsonwebtoken"
//@ts-ignore
import nodemailer from "nodemailer"

//Generate token Function
//Types
interface TokenType {
  _id: Types.ObjectId
  role: string
}
const signToken = (data: TokenType) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "10h" })
}
//Register a user
export const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { nom, prenom, mail, mdp, role, date_de_naissance, num_tel, NBLE } =
        req.body
      if (
        !nom ||
        !prenom ||
        !mail ||
        !mdp ||
        !role ||
        !date_de_naissance ||
        !num_tel
      ) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      const User = await UserModel.create({
        nom,
        prenom,
        mail,
        mdp: await hash(mdp, 10),
        role,
        date_de_naissance,
        num_tel,
        NBLE,
      })
      const accessToken = signToken({
        _id: User._id,
        role: User.role,
      })
      const refreshToken = jwt.sign(
        { _id: User._id, role: User.role },
        process.env.REFRESH_TOKEN_SECRET!
      )
      await RefreshTokenModel.create({
        idUtil: User._id,
        refreshToken,
      })
      res.status(200).json({
        _id: User._id,
        role: User.role,
        accessToken,
        refreshToken,
      })
      //Nodemailer
      //@ts-ignore
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "bobbie.gislason@ethereal.email",
          pass: "UCurANP6eCGauTsB2V",
        },
      })

      const message = {
        from: "your_email@gmail.com",
        to: `${User.mail}`,
        subject: "New Book",
        text: "This is a test email sent using Nodemailer!",
      }
      transporter.sendMail(message, function (error: any, info: any) {
        if (error) {
          console.log(error)
        } else {
          console.log("Email sent: " + info.response)
        }
      })
      res.status(201).json("User created successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Find all users
export const findAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const Users = await UserModel.find()
      res.status(200).json(Users)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Find all users where role="Utilisatuer"
export const findAllUtilisateur = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const Users = await UserModel.find({ role: "Utilisateur" })
      res.status(200).json(Users)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Find all users where role="Utilisateur"
export const findAllEmp = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const Users = await UserModel.find({ role: "Employe" })
      res.status(200).json(Users)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Find a user by id
export const findUserById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const User = await UserModel.findById(id)
      res.status(200).json(User)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Update a User
export const updateUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { _id } = req.user!
      await UserModel.findByIdAndUpdate(_id, req.body)
      res.status(200).json("User updated successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Delete a User
export const deleteUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { _id } = req.user!
      await UserModel.findByIdAndDelete(_id)
      res.status(200).json("User deleted successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Login a User
export const loginUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { mail, mdp } = req.body
      if (!mail || !mdp) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      const UserExist = await UserModel.find({ mail })
      if (UserExist.length === 0) {
        res.status(400)
        throw new Error("User doesn't exist!")
      }
      const passwordMatch = await compare(mdp, UserExist[0].mdp)
      if (!passwordMatch) {
        res.status(400)
        throw new Error("Password doesn't match!")
      }
      const accessToken = signToken({
        _id: UserExist[0]._id,
        role: UserExist[0].role,
      })
      const refreshToken = jwt.sign(
        { _id: UserExist[0]._id, role: UserExist[0].role },
        process.env.REFRESH_TOKEN_SECRET!
      )
      await RefreshTokenModel.create({
        idUtil: UserExist[0]._id,
        refreshToken,
      })
      res.status(200).json({
        _id: UserExist[0]._id,
        role: UserExist[0].role,
        accessToken,
        refreshToken,
      })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Refresh the access token
export const refreshToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { token } = req.body
      //Check if refresh token exists in database
      const tokenExists = await RefreshTokenModel.find({ refreshToken: token })
      if (tokenExists.length === 0) {
        res.status(400)
        throw new Error("Invalid refresh token!")
      }
      const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!)
      const { iat, ...data }: any = userData
      const newToken = signToken(data)
      res.status(400).json({ accessToken: newToken })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Logout a User
export const logoutUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { token } = req.body
      if (!token) {
        res.status(400)
        throw new Error("No refresh Token!")
      }
      await RefreshTokenModel.deleteOne({ refreshToken: token })
      res.status(200).json("User logged out successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
