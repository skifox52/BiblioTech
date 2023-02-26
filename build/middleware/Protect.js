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
import jwt from "jsonwebtoken";
//Protect User
export const protect = expressAsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(400);
            throw new Error("Unauthorized! No token!");
        }
        const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { _id, role } = tokenData;
        req.user = { _id, role };
        next();
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Protect Employe
export const protectEmployee = expressAsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(400);
            throw new Error("Unauthorized! No token!");
        }
        const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { _id, role } = tokenData;
        if (role !== "Employe") {
            res.status(400);
            throw new Error("You are not authorized! You're not an employee!");
        }
        req.user = { _id, role };
        next();
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
