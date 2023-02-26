import { addOneBook, deleteBook, findAll, updateBook, } from "../controllers/LivreController.js";
import { Router } from "express";
import { protect, protectEmployee } from "../middleware/Protect.js";
const LivreRouter = Router()
    .get("/all", protect, findAll)
    .post("/", protectEmployee, addOneBook)
    .put("/:id", protectEmployee, updateBook)
    .delete("/:id", protectEmployee, deleteBook);
export default LivreRouter;
