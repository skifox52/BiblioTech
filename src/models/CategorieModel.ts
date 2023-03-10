import { Types, Schema, model, SchemaTypes } from "mongoose"

interface CatSchemaType {
  idEmp: Types.ObjectId
  nomCat: string
  Data_ajout: Date
}

const CategorieSchema = new Schema<CatSchemaType>(
  {
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
  },
  { timestamps: true }
)

const CatModel = model("Categorie", CategorieSchema)
export default CatModel
