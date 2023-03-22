var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import expressAsyncHandler from "express-async-handler";
import { compare, hash } from "bcrypt";
import RefreshTokenModel from "../models/RefreshTokenModel.js";
import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
//@ts-ignore
import nodemailer from "nodemailer";
const signToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10h" });
};
//Register a user
export const registerUser = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom, prenom, mail, mdp, role, date_de_naissance, num_tel, NBLE } = req.body;
        if (!nom ||
            !prenom ||
            !mail ||
            !mdp ||
            !role ||
            !date_de_naissance ||
            !num_tel) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        const User = yield UserModel.create({
            nom,
            prenom,
            mail,
            mdp: yield hash(mdp, 10),
            role,
            date_de_naissance,
            num_tel,
            NBLE,
        });
        const accessToken = signToken({
            _id: User._id,
            role: User.role,
        });
        const refreshToken = jwt.sign({ _id: User._id, role: User.role }, process.env.REFRESH_TOKEN_SECRET);
        yield RefreshTokenModel.create({
            idUtil: User._id,
            refreshToken,
        });
        res.status(200).json({
            _id: User._id,
            role: User.role,
            accessToken,
            refreshToken,
        });
        //Nodemailer
        //@ts-ignore
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: "bobbie.gislason@ethereal.email",
                pass: "UCurANP6eCGauTsB2V",
            },
        });
        const message = {
            from: "your_email@gmail.com",
            to: `${User.mail}`,
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
        res.status(201).json("User created successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Find all users
export const findAll = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Users = yield UserModel.find();
        res.status(200).json(Users);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Find all users where role="Utilisatuer"
export const findAllUtilisateur = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Users = yield UserModel.find({ role: "Utilisateur" });
        res.status(200).json(Users);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Find all users where role="Utilisateur"
export const findAllEmp = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Users = yield UserModel.find({ role: "Employe" });
        res.status(200).json(Users);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Find a user by id
export const findUserById = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const User = yield UserModel.findById(id);
        res.status(200).json(User);
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Update a User
export const updateUser = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        yield UserModel.findByIdAndUpdate(_id, req.body);
        res.status(200).json("User updated successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Delete a User
export const deleteUser = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        yield UserModel.findByIdAndDelete(_id);
        res.status(200).json("User deleted successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Login a User
export const loginUser = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mail, mdp } = req.body;
        if (!mail || !mdp) {
            res.status(400);
            throw new Error("Empty fields!");
        }
        const UserExist = yield UserModel.find({ mail });
        if (UserExist.length === 0) {
            res.status(400);
            throw new Error("User doesn't exist!");
        }
        const passwordMatch = yield compare(mdp, UserExist[0].mdp);
        if (!passwordMatch) {
            res.status(400);
            throw new Error("Password doesn't match!");
        }
        const accessToken = signToken({
            _id: UserExist[0]._id,
            role: UserExist[0].role,
        });
        const refreshToken = jwt.sign({ _id: UserExist[0]._id, role: UserExist[0].role }, process.env.REFRESH_TOKEN_SECRET);
        yield RefreshTokenModel.create({
            idUtil: UserExist[0]._id,
            refreshToken,
        });
        res.status(200).json({
            _id: UserExist[0]._id,
            role: UserExist[0].role,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Refresh the access token
export const refreshToken = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        //Check if refresh token exists in database
        const tokenExists = yield RefreshTokenModel.find({ refreshToken: token });
        if (tokenExists.length === 0) {
            res.status(400);
            throw new Error("Invalid refresh token!");
        }
        const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const { iat } = userData, data = __rest(userData, ["iat"]);
        const newToken = signToken(data);
        res.status(400).json({ accessToken: newToken });
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
//Logout a User
export const logoutUser = expressAsyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400);
            throw new Error("No refresh Token!");
        }
        yield RefreshTokenModel.deleteOne({ refreshToken: token });
        res.status(200).json("User logged out successfully!");
    }
    catch (error) {
        res.status(400);
        throw new Error(error);
    }
}));
