import { Schema, model } from "mongoose";
const EtudiantSchema = new Schema({
    nom: String,
    prenom: String,
    notes: [
        {
            note: Number,
            coef: Number,
        },
    ],
});
const EtudiantModel = model("Etudiant", EtudiantSchema);
export default EtudiantModel;
