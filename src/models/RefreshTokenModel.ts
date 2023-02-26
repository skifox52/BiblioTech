import { Schema, SchemaTypes, model, Types } from "mongoose"

interface RefreshToken {
  idUtil: Types.ObjectId
  refreshToken: string
}

const RefreshTokenSchema = new Schema<RefreshToken>(
  {
    idUtil: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const RefreshTokenModel = model("RefreshToken", RefreshTokenSchema)
export default RefreshTokenModel
