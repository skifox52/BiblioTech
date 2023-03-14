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
//Planificateur
import cron from "node-cron";
//Vérifier si l'utilisateur a dépasser l'emprunt
const verifierEmprunt = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date().getTime();
        const nonRendu = yield DetailEmpruntModel.find({ rendu: false });
        let Users = [];
        nonRendu.forEach((emp) => {
            //@ts-ignore
            if (emp.createdAt.getTime() + emp.duree * 24 * 3600 < currentDate) {
                //@ts-ignore
                Users.push(emp.id_util);
            }
        });
        if (Users.length > 0) {
            for (let i = 0; i < Users.length; i++) {
                yield UserModel.findByIdAndUpdate(Users[i], { active: false });
            }
        }
    }
    catch (error) {
        throw new Error("Error on scheduler!");
    }
});
//Schedule every day it executes the function
cron.schedule("0 0 0 * * *", () => {
    verifierEmprunt();
});
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
//Renouvler Empreint
export const renouvlerEmpreint = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { duree } = req.query;
        const empreint = yield DetailEmpruntModel.findById(id);
        if (!empreint) {
            res.status(400);
            throw new Error("Pas d'empreint en cours!");
        }
        if (empreint.renew === true) {
            res.status(400);
            throw new Error("Vous avez déja renouveller cet enmpreint!");
        }
        const renewedBooks = yield DetailEmpruntModel.find({
            renew: true,
        }).select("id_livre");
        renewedBooks.forEach((book) => {
            if (book._id.toString() === empreint._id.toString()) {
                res.status(400);
                throw new Error("Vous avez déja renouveller pour ce livre!");
            }
        });
        empreint.duree += parseInt(duree);
        empreint.renew = true;
        yield empreint.save();
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
        yield LivreModel.findByIdAndUpdate(id, { $inc: { nb_restant: 1 } });
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
//Find historique empreint of a user
export const findHistorique = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const historiqueUser = yield DetailEmpruntModel.find({
            id_util: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
        });
        res.status(200).json(historiqueUser);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
