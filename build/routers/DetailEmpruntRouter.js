import { addDetail, findAllDetails, updateDetail, } from "../controllers/DetailEmpruntController.js";
import { Router } from "express";
import { protect } from "../middleware/Protect.js";
const DetailEmpruntRouter = Router()
    .post("/", protect, addDetail)
    .put("/:id", protect, updateDetail)
    .get("/", protect, findAllDetails);
export default DetailEmpruntRouter;
