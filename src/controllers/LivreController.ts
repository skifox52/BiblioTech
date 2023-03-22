import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import LivreModel from "../models/LivreModel.js"
import CommentModel from "../models/CommentModel.js"
import UserModel from "../models/UserModel.js"
//@ts-ignore
import nodemailer from "nodemailer"
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
      //@ts-ignore
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "bobbie.gislason@ethereal.email",
          pass: "UCurANP6eCGauTsB2V",
        },
      })

      UserModel.find()
        .then((user) => {
          user.forEach((us) => {
            const message = {
              from: "your_email@gmail.com",
              to: `${us.mail}`,
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
          })
        })
        .catch((err: any) => {
          console.error(err)
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
//Post commentaire
export const postCommentaire = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { body } = req.body
      if (!body) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      const exists = await LivreModel.findById(id)
      console.log(exists)
      if (!exists) {
        res.status(400)
        throw new Error("Book doesn't exist!")
      }
      const comment = await CommentModel.create({
        id_utilisateur: req.user?._id,
        body,
      })
      await LivreModel.findByIdAndUpdate(id, {
        $push: { commentaires: comment._id },
      })
      res.status(200).json("Comment added successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Modifier un commentaire
export const putComment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { body } = req.body
      if (!body) {
        res.status(400)
        throw new Error("Empty fields!")
      }
      await CommentModel.findByIdAndUpdate(id, { body })
      res.status(202).json("Comment updated successfully!")
    } catch (err: any) {
      res.status(400)
      throw new Error(err)
    }
  }
)
//Supprimer un commentaire
export const deleteComment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await CommentModel.findByIdAndDelete(id)
      res.status(200).json("Comment deleted successfully!")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
//Post Reply comment
export const postReply = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { body } = req.body
      const { id_coment, id_book } = req.params
      //Add to coment model
      const replyComment = await CommentModel.create({
        id_utilisateur: req.user?._id,
        body,
        reply: true,
      })
      //Add the reply
      await LivreModel.findByIdAndUpdate(
        id_book,
        {
          $push: { "commentaires.$[commentaire].reply": replyComment._id },
        },
        { arrayFilters: [{ "commentaire._id": id_coment }] }
      )

      res.status(200).json("Reply added")
    } catch (error: any) {
      res.status(400)
      throw new Error(error)
    }
  }
)
