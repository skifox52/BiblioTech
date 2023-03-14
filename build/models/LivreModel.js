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
        unique: true,
    },
    auteur: {
        type: String,
        required: true,
    },
    nb_emprunt: {
        type: Number,
        default: 0,
    },
    note: {
        type: Number,
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
    commentaires: [
        {
            id_com: { type: SchemaTypes.ObjectId, ref: "Commentaire" },
            reply: [
                {
                    id_reply: { type: SchemaTypes.ObjectId, ref: "Commentaire" },
                },
            ],
            required: false,
        },
    ],
}, {
    timestamps: true,
});
const LivreModel = model("Livre", LivreSchema);
export default LivreModel;
