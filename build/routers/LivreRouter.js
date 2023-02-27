import { addOneBook, deleteBook, findAll, findByAuteur, findByCat, findByNote, updateBook, } from "../controllers/LivreController.js";
import { Router } from "express";
import { protect, protectEmployee } from "../middleware/Protect.js";
const LivreRouter = Router()
    .get("/all", protect, findAll)
    .post("/", protectEmployee, addOneBook)
    .put("/:id", protectEmployee, updateBook)
    .delete("/:id", protectEmployee, deleteBook)
    .get("/cat", protect, findByCat)
    .get("/auteur", protect, findByAuteur)
    .get("/note", protect, findByNote);
export default LivreRouter;
