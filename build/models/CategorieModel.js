import { Schema, model, SchemaTypes } from "mongoose";
const CategorieSchema = new Schema({
    idEmp: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "Utilisateur",
    },
    nomCat: {
        type: String,
        required: true,
    },
    Data_ajout: {
        type: Date,
        default: new Date(),
    },
}, { timestamps: true });
const CatModel = model("Categorie", CategorieSchema);
export default CatModel;
