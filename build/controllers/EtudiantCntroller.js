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
import EtudiantModel from "../models/EtudiantModel.js";
export const ajouterEtudiant = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield EtudiantModel.create(req.body);
        res.status(201).json("added");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
export const calculerMoyenne = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const etudiant = yield EtudiantModel.findById(id);
        let totalnote = 0;
        let totalcoef = 0;
        etudiant === null || etudiant === void 0 ? void 0 : etudiant.notes.forEach((not) => {
            //@ts-ignore
            totalnote += parseInt(not.note) * parseInt(not.coef);
            //@ts-ignore
            totalcoef += parseInt(not.coef);
        });
        let moyenne = totalnote / totalcoef;
        res.status(200).json(moyenne);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
