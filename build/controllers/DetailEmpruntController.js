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
import DetailEmpruntModel from "../models/DetailEmpruntModel.js";
import LivreModel from "../models/LivreModel.js";
import UserModel from "../models/UserModel.js";
// Add detail emprunt
export const addDetail = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { id_livre, duree } = req.body;
        if (!id_livre || !duree) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        // Check if user has more then 3 borrowed books per month
        const canBoroow = yield DetailEmpruntModel.find({
            id_util: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        const month = 2592000000;
        const currentDate = new Date();
        let monthlyBorrowedBooks = [];
        canBoroow.forEach((br) => {
            // @ts-ignore
            if (currentDate - new Date(br.createdAt) <= month) {
                return monthlyBorrowedBooks.push(br);
            }
        });
        if (monthlyBorrowedBooks.length >= 3) {
            res.status(400);
            throw new Error("You can't borrow more then 3 books a month");
        }
        const livre = yield LivreModel.findById(id_livre);
        if ((livre === null || livre === void 0 ? void 0 : livre.nb_restant) === 0) {
            res.status(400);
            throw new Error("No more copies avaible!");
        }
        yield DetailEmpruntModel.create({
            id_util: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            id_livre,
            duree,
        });
        yield UserModel.findByIdAndUpdate((_c = req.user) === null || _c === void 0 ? void 0 : _c._id, { $inc: { NBLE: 1 } });
        yield LivreModel.findByIdAndUpdate(id_livre, {
            $inc: { nb_restant: -1, nb_emprunt: 1 },
        });
        res.status(201).json("Book borowed successfully");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
// Update detail emprunt weh user returns the book
export const updateDetail = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { id_util } = req.body;
        if (!id_util) {
            res.status(400);
            throw new Error("No user specified!");
        }
        yield DetailEmpruntModel.findOneAndUpdate({ id_util, id_livre: id }, { rendu: true });
        res.status(202).json("Book returned successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//FindAllDetails
export const findAllDetails = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allDetailEmprunt = yield DetailEmpruntModel.find();
        res.status(200).json(allDetailEmprunt);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
