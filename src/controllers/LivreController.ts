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
//Livre par catégorie
export const findByCat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { idCat } = req.body
      if (!idCat) {
        res.status(400)
        throw new Error("No category!")
      }
      const book = await LivreModel.find({ idCat })
      res.status(200).json(book)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Livre par auteur
export const findByAuteur = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { auteur } = req.body
      if (!auteur) {
        res.status(400)
        throw new Error("No auteur!")
      }
      const book = await LivreModel.find({ auteur })
      res.status(200).json(book)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Livre par auteur
export const findByNote = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { note } = req.body
      if (!note) {
        res.status(400)
        throw new Error("No note!")
      }
      const book = await LivreModel.find({ note: { $gte: note } })
      res.status(200).json(book)
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
      const { idCat, nomLivre, auteur, nb_total, note } = req.body
      if (!idCat || !nomLivre || !auteur || !nb_total || !note) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      await LivreModel.create({
        idCat,
        nomLivre,
        auteur,
        nb_total,
        note,
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
