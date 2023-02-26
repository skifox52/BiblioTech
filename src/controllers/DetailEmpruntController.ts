import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import DetailEmpruntModel from "../models/DetailEmpruntModel.js"
import LivreModel from "models/LivreModel.js"

// Add detail emprunt
export const addDetail = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id_util, id_livre, duree } = req.body
      if (!id_util || !id_livre || !duree) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      const livre = await LivreModel.findById(id_livre)
      if (livre?.nb_restant === 0) {
        res.status(400)
        throw new Error("No more copies avaible!")
      }
      await DetailEmpruntModel.create({
        id_util,
        id_livre,
        duree,
      })
      await LivreModel.findByIdAndUpdate(id_livre, { nb_restant: { $inc: -1 } })
      res.status(201).json("Book borowed successfully")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
// Update detail emprunt
export const updateDetail = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
    } catch (error) {}
  }
)
