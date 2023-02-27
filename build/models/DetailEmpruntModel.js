import { SchemaTypes, Schema, model } from "mongoose";
//Detail Schame
const DetailEmpruntSchema = new Schema({
    id_util: {
        type: SchemaTypes.ObjectId,
        ref: "Utilisateur",
        required: true,
    },
    id_livre: {
        type: SchemaTypes.ObjectId,
        ref: "Livre",
        required: true,
    },
    duree: {
        type: Number,
        required: true,
    },
    rendu: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const DetailEmpruntModel = model("DetailEmprunt", DetailEmpruntSchema);
export default DetailEmpruntModel;
