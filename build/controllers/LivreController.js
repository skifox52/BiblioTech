var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import expressAsyncHandler from "express-async-handler";
import LivreModel from "../models/LivreModel.js";
import CommentModel from "../models/CommentModel.js";
import UserModel from "../models/UserModel.js";
//@ts-ignore
import nodemailer from "nodemailer";
// Afficher tout les livres
export const findAll = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBooks = yield LivreModel.find();
        res.status(200).json(allBooks);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Livre par catégorie
export const findByCat = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idCat } = req.body;
        if (!idCat) {
            res.status(400);
            throw new Error("No category!");
        }
        const book = yield LivreModel.find({ idCat });
        res.status(200).json(book);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Livre par auteur
export const findByAuteur = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auteur } = req.body;
        if (!auteur) {
            res.status(400);
            throw new Error("No auteur!");
        }
        const book = yield LivreModel.find({ auteur });
        res.status(200).json(book);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Livre par auteur
export const findByNote = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { note } = req.body;
        if (!note) {
            res.status(400);
            throw new Error("No note!");
        }
        const book = yield LivreModel.find({ note: { $gte: note } });
        res.status(200).json(book);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
// Ajouter un livre
export const addOneBook = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idCat, nomLivre, auteur, nb_total, note } = req.body;
        if (!idCat || !nomLivre || !auteur || !nb_total || !note) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        yield LivreModel.create({
            idCat,
            nomLivre,
            auteur,
            nb_total,
            note,
        });
        //@ts-ignore
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: "bobbie.gislason@ethereal.email",
                pass: "UCurANP6eCGauTsB2V",
            },
        });
        UserModel.find()
            .then((user) => {
            user.forEach((us) => {
                const message = {
                    from: "your_email@gmail.com",
                    to: `${us.mail}`,
                    subject: "New Book",
                    text: "This is a test email sent using Nodemailer!",
                };
                transporter.sendMail(message, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log("Email sent: " + info.response);
                    }
                });
            });
        })
            .catch((err) => {
            console.error(err);
        });
        res.status(201).json("Book created successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
// Modifier un livre
export const updateBook = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield LivreModel.findByIdAndUpdate(id, req.body);
        res.status(202).json("Book updated successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
// Supprimer un livre
export const deleteBook = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield LivreModel.findByIdAndDelete(id);
        res.status(200).json("Book deleted successfullty!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Post commentaire
export const postCommentaire = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { body } = req.body;
        if (!body) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        const exists = yield LivreModel.findById(id);
        console.log(exists);
        if (!exists) {
            res.status(400);
            throw new Error("Book doesn't exist!");
        }
        const comment = yield CommentModel.create({
            id_utilisateur: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            body,
        });
        yield LivreModel.findByIdAndUpdate(id, {
            $push: { commentaires: comment._id },
        });
        res.status(200).json("Comment added successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Modifier un commentaire
export const putComment = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { body } = req.body;
        if (!body) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        yield CommentModel.findByIdAndUpdate(id, { body });
        res.status(202).json("Comment updated successfully!");
    }
    catch (err) {
        res.status(400);
        throw new Error(err);
    }
}));
//Supprimer un commentaire
export const deleteComment = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield CommentModel.findByIdAndDelete(id);
        res.status(200).json("Comment deleted successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Post Reply comment
export const postReply = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { body } = req.body;
        const { id_coment, id_book } = req.params;
        //Add to coment model
        const replyComment = yield CommentModel.create({
            id_utilisateur: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            body,
            reply: true,
        });
        //Add the reply
        yield LivreModel.findByIdAndUpdate(id_book, {
            $push: { "commentaires.$[commentaire].reply": replyComment._id },
        }, { arrayFilters: [{ "commentaire._id": id_coment }] });
        res.status(200).json("Reply added");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
