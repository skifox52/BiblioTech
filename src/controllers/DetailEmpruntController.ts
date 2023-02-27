import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import DetailEmpruntModel from "../models/DetailEmpruntModel.js"
import LivreModel from "../models/LivreModel.js"
import UserModel from "../models/UserModel.js"

// Add detail emprunt
export const addDetail = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id_livre, duree } = req.body
      if (!id_livre || !duree) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      // Check if user has more then 3 borrowed books per month
      const canBoroow = await DetailEmpruntModel.find({
        id_util: req.user?._id,
      })
      const month = 2592000000
      const currentDate = new Date()
      let monthlyBorrowedBooks: any[] = []
      canBoroow.forEach((br) => {
        // @ts-ignore
        if (currentDate - new Date(br.createdAt) <= month) {
          return monthlyBorrowedBooks.push(br)
        }
      })
      if (monthlyBorrowedBooks.length >= 3) {
        res.status(400)
        throw new Error("You can't borrow more then 3 books a month")
      }
      const livre = await LivreModel.findById(id_livre)
      if (livre?.nb_restant === 0) {
        res.status(400)
        throw new Error("No more copies avaible!")
      }
      await DetailEmpruntModel.create({
        id_util: req.user?._id,
        id_livre,
        duree,
      })
      await UserModel.findByIdAndUpdate(req.user?._id, { $inc: { NBLE: 1 } })
      await LivreModel.findByIdAndUpdate(id_livre, {
        $inc: { nb_restant: -1, nb_emprunt: 1 },
      })
      res.status(201).json("Book borowed successfully")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
// Update detail emprunt weh user returns the book
export const updateDetail = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { id_util } = req.body
      if (!id_util) {
        res.status(400)
        throw new Error("No user specified!")
      }
      await DetailEmpruntModel.findOneAndUpdate(
        { id_util, id_livre: id },
        { rendu: true }
      )
      res.status(202).json("Book returned successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//FindAllDetails
export const findAllDetails = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const allDetailEmprunt = await DetailEmpruntModel.find()
      res.status(200).json(allDetailEmprunt)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
