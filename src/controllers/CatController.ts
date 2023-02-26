import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import CatModel from "../models/CategorieModel.js"
import LivreModel from "../models/LivreModel.js"

//Find All cats
export const findAllCat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const cats = await CatModel.find()
      res.status(200).json(cats)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Add a cat
export const addCat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { nomCat } = req.body
      if (!nomCat) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      await CatModel.create({ idEmp: req.user?._id, nomCat })
      res.status(200).json("Category created successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Update a cat
export const updateCat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await CatModel.findByIdAndUpdate(id, req.body)
      res.status(202).json("Category updated successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Delete a cat
export const deleteCat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await CatModel.findByIdAndDelete(id)
      await LivreModel.findByIdAndDelete({ idCat: id })
      res.status(200).json("Category deleted successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
