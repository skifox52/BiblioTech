import { model, Schema, SchemaTypes } from "mongoose";
const CommentSchema = new Schema({
    id_utilisateur: {
        type: SchemaTypes.ObjectId,
        ref: "Utilisateur",
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    reply: { type: Boolean, default: false },
}, { timestamps: true });
const CommentModel = model("Commentaire", CommentSchema);
export default CommentModel;
