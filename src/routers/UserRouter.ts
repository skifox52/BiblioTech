import {
  deleteUser,
  findAll,
  findAllEmp,
  findAllUtilisateur,
  findUserById,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  updateUser,
} from "../controllers/UserController.js"
import { protect } from "../middleware/Protect.js"
import { Router } from "express"
const UserRouter = Router()
  .get("/all", protect, findAll)
  .get("/utilisateur", protect, findAllUtilisateur)
  .get("/employe", protect, findAllEmp)
  .post("/", registerUser)
  .put("/", protect, updateUser)
  .delete("/", protect, deleteUser)
  .get("/:id", protect, findUserById)
  .post("/login", loginUser)
  .delete("/logout", protect, logoutUser)
  .post("/token", protect, refreshToken)
export default UserRouter
