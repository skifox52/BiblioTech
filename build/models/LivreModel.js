import { Schema, SchemaTypes, model } from "mongoose";
//Livre Schema
const LivreSchema = new Schema({
    idCat: {
        type: SchemaTypes.ObjectId,
        ref: "Categorie",
        required: true,
    },
    nomLivre: {
        type: String,
        required: true,
    },
    auteur: {
        type: String,
        required: true,
    },
    nb_total: {
        type: Number,
        required: true,
    },
    nb_restant: {
        type: Number,
        default: function () {
            return this.nb_total;
        },
    },
}, {
    timestamps: true,
});
const LivreModel = model("Livre", LivreSchema);
export default LivreModel;
