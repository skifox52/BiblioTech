import express, { Application, Request, Response } from "express"
import { connect } from "mongoose"
import ErrorHandler from "./middleware/ErrorHandler.js"
import "dotenv/config"
import UserRouter from "./routers/UserRouter.js"
import catRouter from "./routers/CatRouter.js"
import LivreRouter from "./routers/LivreRouter.js"
import DetailEmpruntRouter from "./routers/DetailEmpruntRouter.js"
import StatsRouter from "./routers/StatsRouter.js"

const app: Application = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/user", UserRouter)
app.use("/api/category", catRouter)
app.use("/api/livre", LivreRouter)
app.use("/api/detail", DetailEmpruntRouter)
app.use("/api/stats", StatsRouter)
//Not found
app.use("/*", (req: Request, res: Response) => {
  res.status(404)
  throw new Error("Not Found!")
})

//Error Handler Middleware
app.use(ErrorHandler)
//Connect Database
connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(process.env.PORT, () => console.log("server running"))
  })
  .catch((err) => {
    console.log(err)
  })
