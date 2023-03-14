import { addDetail, findAllDetails, findHistorique, renouvlerEmpreint, updateDetail, } from "../controllers/DetailEmpruntController.js";
import { Router } from "express";
import { protect } from "../middleware/Protect.js";
const DetailEmpruntRouter = Router()
    .post("/", protect, addDetail)
    .get("/", protect, findAllDetails)
    .get("/user", protect, findHistorique)
    .get("/:id", protect, updateDetail)
    .put("/:id", protect, renouvlerEmpreint);
export default DetailEmpruntRouter;
