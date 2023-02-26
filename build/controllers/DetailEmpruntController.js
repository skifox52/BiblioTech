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
import LivreModel from "models/LivreModel.js";
// Add detail emprunt
export const addDetail = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_util, id_livre, duree } = req.body;
        if (!id_util || !id_livre || !duree) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        const livre = yield LivreModel.findById(id_livre);
        if ((livre === null || livre === void 0 ? void 0 : livre.nb_restant) === 0) {
            res.status(400);
            throw new Error("No more copies avaible!");
        }
        yield DetailEmpruntModel.create({
            id_util,
            id_livre,
            duree,
        });
        yield LivreModel.findByIdAndUpdate(id_livre, { nb_restant: { $inc: -1 } });
        res.status(201).json("Book borowed successfully");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
// Update detail emprunt
export const updateDetail = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
}));
