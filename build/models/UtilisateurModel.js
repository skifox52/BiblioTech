import { Schema } from "mongoose";
const UserSchema = new Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
        unique: true,
    },
    mdp: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    date_de_naissance: {
        type: Date,
        required: true,
    },
    num_tel: {
        type: Number,
        required: true,
    },
    NBLE: {
        type: Number,
        required: true,
    },
});
export default UserSchema;
