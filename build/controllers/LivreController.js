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
