import { Schema, Types, SchemaTypes, model } from "mongoose"

//Schema Type
interface LivreSchemaType {
  idCat: Types.ObjectId
  nomLivre: string
  auteur: string
  nb_total: number
  nb_restant: number
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
        return this.nb_total
      },
    },
  },
  {
    timestamps: true,
  }
)

const LivreModel = model("Livre", LivreSchema)
export default LivreModel
