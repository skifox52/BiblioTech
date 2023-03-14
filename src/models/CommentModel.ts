import { model, Schema, Types, SchemaTypes } from "mongoose"
//Comment type
export type CommentaireType = {
  id_utilisateur: Types.ObjectId
  body: string
  reply: boolean
}
const CommentSchema = new Schema<CommentaireType>(
  {
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
  },
  { timestamps: true }
)

const CommentModel = model("Commentaire", CommentSchema)
export default CommentModel
