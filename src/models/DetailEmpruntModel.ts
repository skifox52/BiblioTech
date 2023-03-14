import { Types, SchemaTypes, Schema, model } from "mongoose"

//Schema type
interface DetailSchemaType {
  id_util: Types.ObjectId
  id_livre: Types.ObjectId
  duree: number
  rendu: boolean
  renew: boolean
}
//Detail Schame
const DetailEmpruntSchema = new Schema<DetailSchemaType>(
  {
    id_util: {
      type: SchemaTypes.ObjectId,
      ref: "Utilisateur",
      required: true,
    },
    id_livre: {
      type: SchemaTypes.ObjectId,
      ref: "Livre",
      required: true,
    },
    duree: {
      type: Number,
      required: true,
    },
    rendu: {
      type: Boolean,
      default: false,
    },
    renew: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const DetailEmpruntModel = model("DetailEmprunt", DetailEmpruntSchema)
export default DetailEmpruntModel
