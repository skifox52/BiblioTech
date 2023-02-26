import { Schema, SchemaTypes, model } from "mongoose";
const RefreshTokenSchema = new Schema({
    idUtil: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const RefreshTokenModel = model("RefreshToken", RefreshTokenSchema);
export default RefreshTokenModel;
