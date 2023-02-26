import { Schema, model, SchemaTypes } from "mongoose";
const CategorieSchema = new Schema({
    idEmp: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "Utilisateur",
    },
    nomCat: {
        type: String,
        unique: true,
        required: true,
    },
}, { timestamps: true });
const CatModel = model("Categorie", CategorieSchema);
export default CatModel;
