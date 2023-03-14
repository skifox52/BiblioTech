import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import DetailEmpruntModel from "../models/DetailEmpruntModel.js"
import LivreModel from "../models/LivreModel.js"
import UserModel from "../models/UserModel.js"
/*
nb prètes
livre plus prèter
nb_lecteur
*/
export const Stats = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const nb_prets = DetailEmpruntModel.count()
      const lv_p = LivreModel.find()
        .sort({ nb_emprunt: -1 })
        .limit(1)
        .select("nomLivre")
      const nb_l = UserModel.find({ role: "Utilisateur" }).count()
      const result = await Promise.all([nb_prets, lv_p, nb_l])
      res.status(400).json({
        "Nombre de Livres prèté": result[0],
        "Livre le plus prèté": result[1][0].nomLivre,
        "Nombre de lécteurs": result[2],
      })
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
