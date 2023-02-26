import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import LivreModel from "../models/LivreModel.js"

// Afficher tout les livres
export const findAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const allBooks = await LivreModel.find()
      res.status(200).json(allBooks)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
// Ajouter un livre
export const addOneBook = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { idCat, nomLivre, auteur, nb_total, nb_restant } = req.body
      if (!idCat || !nomLivre || !auteur || !nb_total || !nb_restant) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      await LivreModel.create({
        idCat,
        nomLivre,
        auteur,
        nb_total,
        nb_restant,
      })
      res.status(201).json("Book created successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
// Modifier un livre
export const updateBook = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await LivreModel.findByIdAndUpdate(id, req.body)
      res.status(202).json("Book updated successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
// Supprimer un livre
export const deleteBook = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await LivreModel.findByIdAndDelete(id)
      res.status(200).json("Book deleted successfullty!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
