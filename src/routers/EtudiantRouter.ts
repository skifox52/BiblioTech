import {
  ajouterEtudiant,
  calculerMoyenne,
} from "../controllers/EtudiantCntroller.js"
import { Router } from "express"
const etudiantRouter = Router()
  .post("/", ajouterEtudiant)
  .get("/:id", calculerMoyenne)

export default etudiantRouter
