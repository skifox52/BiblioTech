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
/*
nb prètes
livre plus prèter
nb_lecteur
*/
export const Stats = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nb_prets = DetailEmpruntModel.count();
        const lv_p = LivreModel.find()
            .sort({ nb_emprunt: -1 })
            .limit(1)
            .select("nomLivre");
        const nb_l = UserModel.find({ role: "Utilisateur" }).count();
        const result = yield Promise.all([nb_prets, lv_p, nb_l]);
        res.status(400).json({
            "Nombre de Livres prèté": result[0],
            "Livre le plus prèté": result[1][0].nomLivre,
            "Nombre de lécteurs": result[2],
        });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
