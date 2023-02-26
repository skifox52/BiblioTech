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
import CatModel from "models/CategorieModel";
//Find All cats
export const findAllCat = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cats = yield CatModel.find();
        res.status(200).json(cats);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Add a cat
export const addCat = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { nomCat } = req.body;
        yield CatModel.create({ idEmp: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, nomCat });
        res.status(200).json("Category created successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Update a cat
export const updateCat = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield CatModel.findByIdAndUpdate(id, req.body);
        res.status(202).json("Category updated successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Delete a cat
export const deleteCat = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield CatModel.findByIdAndDelete(id);
        res.status(200).json("Category deleted successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
