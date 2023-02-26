import express, { Application, Request, Response } from "express"
import { connect } from "mongoose"
import ErrorHandler from "./middleware/ErrorHandler.js"
import "dotenv/config"
import UserRouter from "./routers/UserRouter.js"
import catRouter from "./routers/CatRouter.js"
import LivreRouter from "./routers/LivreRouter.js"

const app: Application = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/user", UserRouter)
app.use("/api/category", catRouter)
app.use("/api/livre", LivreRouter)

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
