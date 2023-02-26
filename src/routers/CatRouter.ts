import {
  addCat,
  deleteCat,
  findAllCat,
  updateCat,
} from "../controllers/CatController.js"
import { Router } from "express"
import { protectEmployee, protect } from "../middleware/Protect.js"

const catRouter = Router()
  .get("/all", protect, findAllCat)
  .post("/", protectEmployee, addCat)
  .put("/:id", protectEmployee, updateCat)
  .delete("/:id", protectEmployee, deleteCat)

export default catRouter
