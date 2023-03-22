import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import EtudiantModel from "../models/EtudiantModel.js"

export const ajouterEtudiant = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      await EtudiantModel.create(req.body)
      res.status(201).json("added")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)

export const calculerMoyenne = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const etudiant = await EtudiantModel.findById(id)
      let totalnote = 0
      let totalcoef = 0
      etudiant?.notes.forEach((not) => {
        //@ts-ignore
        totalnote += parseInt(not.note) * parseInt(not.coef)
        //@ts-ignore
        totalcoef += parseInt(not.coef)
      })
      let moyenne = totalnote / totalcoef
      res.status(200).json(moyenne)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
