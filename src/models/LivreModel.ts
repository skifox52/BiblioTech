import { Schema, Types, SchemaTypes, model } from "mongoose"

//Schema Type
interface LivreSchemaType {
  idCat: Types.ObjectId
  nomLivre: string
  auteur: string
  nb_emprunt: number
  note: number
  nb_total: number
  nb_restant: number
  commentaires?: Types.ObjectId[]
}
//Livre Schema
const LivreSchema = new Schema<LivreSchemaType>(
  {
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
        return this.nb_total
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
  },
  {
    timestamps: true,
  }
)
const LivreModel = model<LivreSchemaType>("Livre", LivreSchema)
export default LivreModel
