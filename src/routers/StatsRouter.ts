import { Stats } from "../controllers/StatsController.js"
import { Router } from "express"
import { protectAdmin } from "../middleware/Protect.js"
const StatsRouter = Router().get("/", protectAdmin, Stats)

export default StatsRouter
