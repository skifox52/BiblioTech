import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import DetailEmpruntModel from "../models/DetailEmpruntModel.js"
import LivreModel from "../models/LivreModel.js"
import UserModel from "../models/UserModel.js"
//Planificateur
import cron from "node-cron"
//Vérifier si l'utilisateur a dépasser l'emprunt
const verifierEmprunt = async () => {
  try {
    const currentDate = new Date().getTime()
    const nonRendu = await DetailEmpruntModel.find({ rendu: false })
    let Users: [] = []
    nonRendu.forEach((emp) => {
      //@ts-ignore
      if (emp.createdAt.getTime() + emp.duree * 24 * 3600 < currentDate) {
        //@ts-ignore
        Users.push(emp.id_util)
      }
    })
    if (Users.length > 0) {
      for (let i = 0; i < Users.length; i++) {
        await UserModel.findByIdAndUpdate(Users[i], { active: false })
      }
    }
  } catch (error) {
    throw new Error("Error on scheduler!")
  }
}

//Schedule every day it executes the function
cron.schedule("0 0 0 * * *", () => {
  verifierEmprunt()
})
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
//Renouvler Empreint
export const renouvlerEmpreint = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { duree }: number | any = req.query
      const empreint = await DetailEmpruntModel.findById(id)
      if (!empreint) {
        res.status(400)
        throw new Error("Pas d'empreint en cours!")
      }
      if (empreint.renew === true) {
        res.status(400)
        throw new Error("Vous avez déja renouveller cet enmpreint!")
      }
      const renewedBooks = await DetailEmpruntModel.find({
        renew: true,
      }).select("id_livre")
      renewedBooks.forEach((book) => {
        if (book._id.toString() === empreint._id.toString()) {
          res.status(400)
          throw new Error("Vous avez déja renouveller pour ce livre!")
        }
      })
      empreint.duree += parseInt(duree)
      empreint.renew = true
      await empreint.save()
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
      await LivreModel.findByIdAndUpdate(id, { $inc: { nb_restant: 1 } })
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
//Find historique empreint of a user
export const findHistorique = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const historiqueUser = await DetailEmpruntModel.find({
        id_util: req.user?._id,
      })
      res.status(200).json(historiqueUser)
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
