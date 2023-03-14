import { Schema, model } from "mongoose";
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
        enum: ["Utilisateur", "Employe", "Admin"],
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
        default: 0,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
//Réactiver le compte après 10 jours de suspension
UserSchema.post("findOneAndUpdate", function (doc) {
    const updated = this.getUpdate();
    //@ts-ignore
    const updatedFields = updated["$set"];
    if ("active" in updatedFields) {
        if (updatedFields["active"] === false) {
            setTimeout(() => {
                doc.active = true;
                doc.save();
            }, 864000000);
        }
        else {
            return;
        }
    }
});
const UserModel = model("Utilisateur", UserSchema);
export default UserModel;
